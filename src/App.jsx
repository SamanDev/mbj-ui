import React, { useState, useEffect } from "react";
// Setup WebSocket ba address server
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");
let playerRightBet = document.querySelectorAll(".rsidebet");

if (pathArr.length == 3) {
    localStorage.setItem("token", pathArr[1]);
    localStorage.setItem("username", pathArr[2]);
    window.location = "/";
}
let _token = localStorage.getItem("token");
let _auth = _token;
const WEB_URL = process.env.NODE_ENV === "production" ? `wss://${process.env.REACT_APP_DOMAIN_NAME}/` : `ws://localhost:8080`;

const socket = new WebSocket(WEB_URL, _auth); // IP va port ro taghir bede

const doCurrency = (value) => {
    var val = value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return val;
};
const doCurrencyMil = (value, fix) => {
    if (value < 1000000) {
        var val = doCurrency(parseFloat(value / 1000).toFixed(fix || fix == 0 ? fix : 0)) + "K";
    } else {
        var val = doCurrency(parseFloat(value / 1000000).toFixed(fix || fix == 0 ? fix : 0)) + "M";
    }
    return val;
};

const BlackjackGame = () => {
    var _totalBet = 0;
    const [gameData, setGameData] = useState(null); // Baraye zakhire JSON object
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        // Event onopen baraye vaghti ke websocket baz shode
        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        // Event onmessage baraye daryaft data az server
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse kardan JSON daryafti
            console.log("Game data received: ", data);
            if (data.method == "tables") {
                setGameData(data.games[0]); // Update kardan state
            }
            if (data.method == "connect") {
                setUserData(data.theClient); // Update kardan state
            }
        };

        // Event onclose baraye vaghti ke websocket baste mishe
        socket.onclose = () => {
            console.log("WebSocket closed");
        };

        // Cleanup websocket dar zamane unmount kardan component
        return () => {
            // socket.close();
        };
    }, []);

    // Agar gameData nist, ye matn "Loading" neshan bede
    if (!gameData || !userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div id="game-room" className="hide-element">
                <div id="dark-overlay"></div>

                <div id="table-graphics"></div>

                <button id="leave-button">
                    <i className="fas fa-sign-out-alt"></i>
                    EXIT ROOM
                </button>

                <button id="leave-table" className="noclick">
                    <i className="far fa-arrow-alt-circle-left"></i>
                    LEAVE TABLE
                </button>

                <div id="volume-button">
                    <i className="fas fa-volume-up"></i>
                </div>
                {gameData.startTimer >= 0 && (
                    <div id="deal-start-label" className="hide-element">
                        <p>
                            Waiting for bets <span id="seconds">{gameData.startTimer}</span>
                        </p>
                    </div>
                )}

                <div id="dealer">
                    <h1>DEALER</h1>
                    {gameData.dealer?.sum && <div id="dealerSum">{gameData.dealer?.sum}</div>}
                    {gameData.dealer?.cards && (
                        <div className="dealer-cards" style={{ marginLeft: gameData.dealer?.cards.length * -40 }}>
                            <div className="visibleCards">
                                {gameData.dealer?.cards.map(function (card, i) {
                                    return <img key={i} className={"animate__slideInUp animate__animated dealerCardImg"} src={"/imgs/" + card.suit + card.value.card + ".svg"} />;
                                })}
                                {gameData.dealer?.cards.length == 1 && (
                                    <div className="flip-card">
                                        <div className="flip-card-inner">
                                            <div className="flip-card-front">
                                                <img className="dealerCardImg card-front" src="/imgs/Card_back.svg" />
                                            </div>
                                            <div className="flip-card-back">
                                                <img className="dealerCardImg card-back" src="/imgs/Diamond7.svg" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="hiddenCard">
                                <img src="/imgs/Card_back.svg" alt="" />
                            </div>
                        </div>
                    )}
                </div>

                <div id="players-container">
                    {gameData.players.map(function (player, pNumber) {
                        if (player.nickname == userData.nickname) {
                            _totalBet = _totalBet + player.bet;
                        }
                        var _resClass = "";

                        var _res = "";
                        if (gameData.dealer?.sum >= 17) {
                            if (gameData.dealer?.sum > player.sum) {
                                _res = "LOSE";
                                _resClass = "result-lose";
                            }
                            if (gameData.dealer?.sum < player.sum) {
                                _res = "WIN";
                                _resClass = "result-win";
                            }
                            if (gameData.dealer?.sum == player.sum) {
                                _res = "DRAW";
                                _resClass = "result-draw";
                            }
                        }
                        if (player.sum > 21) {
                            _res = "🔥";
                            _resClass = "result-lose";
                        }
                        if (player.blackjack) {
                            _res = "BJ";
                            _resClass = "result-blackjack";
                        }
                        var _renge = [gameData.min];
                        _renge.push(_renge[0] * 2);
                        _renge.push(_renge[0] * 5);
                        _renge.push(_renge[0] * 10);

                        return (
                            <span className="players" key={pNumber}>
                                {!player?.nickname ? (
                                    <>
                                        <div className={gameData.gameOn ? "empty-slot noclick" : "empty-slot"} onClick={() => socket.send(JSON.stringify({ method: "join", theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                            <i className="fas fa-user-plus"></i>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {!gameData.gameOn && !player.bet && player.nickname == userData.nickname && (
                                            
                                                <div id="bets-container">
                                                    {_renge.map(function (bet, i) {
                                                        return (
                                                            <span key={i}>
                                                                <button className="betButtons update-balance-bet animate__animated animate__zoomInUp" id={"chip" + i} value={bet * 1000} onClick={() => socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                                                    {doCurrencyMil(bet * 1000)}
                                                                </button>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            
                                        )}
                                        {!gameData.gameOn && player.bet && (
                                            <>
                                                <div id="bets-container-right">
                                                    {_renge.map(function (bet, i) {
                                                        if (i < 2) {
                                                            return (
                                                                <span key={i} className="rsidebet">
                                                                    <button className="betButtons update-balance-bet" id={"chip" + i} value={bet * 1000} onClick={() => socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                                                        {doCurrencyMil(bet * 1000)}
                                                                    </button>
                                                                </span>
                                                            );
                                                        }
                                                    })}
                                                    <span>
                                                        <button className="betButtons update-balance-bet" onClick={() => playerRightBet.classList.remove("rsidebet")}>
                                                            Flush
                                                        </button>
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {gameData.gameOn && gameData.currentPlayer == pNumber && player.nickname == userData.nickname ? (
                                            <div className="user-action-container  animate__slideInUp animate__animated">
                                                <div id="your-turn-label">MAKE A DECISION</div>

                                                <div className="user-action-box">
                                                    <button className="user-action" id="stand" onClick={() => socket.send(JSON.stringify({ method: "stand", gameId: gameData.id, seat: pNumber }))}>
                                                        <i className="fas fa-hand-paper"></i>
                                                    </button>
                                                    <div className="user-action-text">STAND</div>
                                                </div>
                                                <div className="user-action-box">
                                                    <button className="user-action" id="hit" onClick={() => socket.send(JSON.stringify({ method: "hit", gameId: gameData.id, seat: pNumber }))}>
                                                        <i className="fas fa-hand-pointer"></i>
                                                    </button>
                                                    <div className="user-action-text">HIT</div>
                                                </div>
                                                {player.cards.length == 2 && (
                                                    <div className="user-action-box  hide-element">
                                                        <button className="user-action" id="doubleDown">
                                                            <i className="fas fa-hand-peace"></i>
                                                            <span>2X</span>
                                                        </button>
                                                        <div className="user-action-text">DOUBLE</div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            
                                                <div className={gameData.currentPlayer == pNumber ? "player-name highlight" : "player-name"}>
                                                    {player.nickname}
                                                    <span className="hide-element">
                                                        <img className="player-avatar" src={"/imgs/avatars/" + player.avatar + ".png"} alt="avatar" />
                                                    </span>
                                                </div>
                                            
                                        )}

                                        {player.sum && <div className={gameData.currentPlayer == pNumber ? "current-player-highlight player-sum" : "player-sum " + _resClass}>{player.sum}</div>}
                                        {player.bet ? (
                                            <div className="player-coin animate__slideInDown animate__animated">
                                                <button className="betButtons update-balance-bet" id={"chip" + _renge.findIndex((bet) => bet == player.bet / 1000)}>
                                                    {doCurrencyMil(player.bet)}
                                                </button>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {_res && <div className={"player-result " + _resClass}>{_res}</div>}

                                        <div className="player-cards">
                                            {player.cards.map(function (card, i) {
                                                return <img key={i} className={"animate__slideInDown animate__animated cardImg card" + (i + 1)} src={"/imgs/" + card.suit + card.value.card + ".svg"} />;
                                            })}
                                        </div>
                                    </>
                                )}
                            </span>
                        );
                    })}
                </div>

                <div id="players-timer-container">
                    {gameData.players.map(function (player, pNumber) {
                        return (
                            <svg className="players-timer" key={pNumber}>
                                <circle className={gameData.currentPlayer == pNumber ? "circle-animation" : ""} cx="48.5" cy="48.5" r="45" stroke-width="4" fill="transparent" />
                            </svg>
                        );
                    })}
                </div>

                <div id="balance-bet-box">
                    <div className="balance-bet">
                        Balance
                        <div id="balance">{userData.balance}</div>
                    </div>
                    <div className="balance-bet">
                        Total Bet
                        <div id="total-bet">{_totalBet}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlackjackGame;
