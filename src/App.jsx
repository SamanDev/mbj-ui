import React, { useState, useEffect } from "react";
import $ from "jquery";

let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1];
}
const WEB_URL = process.env.REACT_APP_MODE === "production" ? `wss://${process.env.REACT_APP_DOMAIN_NAME}/` : `ws://${loc.hostname}:8080`;

// (A) LOCK SCREEN ORIENTATION

const doCurrency = (value) => {
    var val = value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return val;
};
const doCurrencyMil = (value, fix) => {
    if (value < 1000000) {
        var val = doCurrency(parseFloat(value / 1000).toFixed(fix || fix == 0 ? fix : 0)) + "K";
    } else {
        var val = doCurrency(parseFloat(value / 1000000).toFixed(fix || fix == 0 ? fix : 1)) + "M";
        val = val.replace(".0", "");
    }
    return val;
};
const AppOrtion = () => {
    var gWidth = $("#root").width()/1450;
    
   
    
  
    var scale = gWidth;
var highProtect = $("#root").height()*scale;
    if(highProtect<750){
        var gHight = $("#root").height()/750;
       // scale = (scale + gHight)/2;
        scale =  gHight;
        setTimeout(() => {
            
            $("#scale").css("transform", "scale(" + (scale) + ")");
        
        }, 10);
    }else{
        setTimeout(() => {
            $("#scale").css("transform", "scale(" + (scale) + ")");
        }, 10);
    }

   // console.log(gWidth,highProtect,gHight,scale)
   
};
const socket = new WebSocket(WEB_URL, _auth);
window.addEventListener("message", function (event) {
    

    if (event?.data?.username) {
        const payLoad = {
            method: "syncBalance",

            balance: event?.data?.balance,
        };
        try {
            socket.send(JSON.stringify(payLoad));
        } catch (error) {}
    }
});
var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent, function() {
    AppOrtion(window.orientation?window.orientation:0)
   
}, false);
window.parent.postMessage("userget", "*");

if (window.self == window.top) {
    //window.location.href = "https://www.google.com/";
}
const BlackjackGame = () => {
    var _countBet = 0;

    var _totalBet = 0;
    var _totalWin = 0;
    const [gamesData, setGamesData] = useState([]);
    const [gameData, setGameData] = useState(null); // Baraye zakhire JSON object
    const [userData, setUserData] = useState(null);
    const [gameId, setGameId] = useState(0);

    useEffect(() => {
        

        // Event onopen baraye vaghti ke websocket baz shode

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        // Event onmessage baraye daryaft data az server
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse kardan JSON daryafti
            //console.log("Game data received: ", data);
            if (data.method == "tables") {
                setGamesData(data.games);

                // Update kardan state
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
    useEffect(() => {
        // console.log("gameId",gameId)
        if (gameId == 0) {
            $("body").css("background", "#262a2b");
        } else {
            if (gameId == gamesData[0].id) {
                $("body").css("background", "radial-gradient(#388183, #1e3d42)");
            }
            if (gameId == gamesData[1].id) {
                $("body").css("background", "radial-gradient(#837538, #423e1e)");
            }
            if (gameId == gamesData[2].id) {
                $("body").css("background", "radial-gradient(#723883, #1e2b42)");
            }
            if (gameId == gamesData[3].id) {
                $("body").css("background", "radial-gradient(#833838, #421e1e)");
            }
        }
    }, [gameId]);
    useEffect(() => {
        if (gamesData.length) {
            var _data = gamesData.filter((game) => game?.id === gameId)[0];
            //console.log(_data);

            setGameData(_data);
        }
        AppOrtion(0);
    }, [gamesData, gameId]);
    // Agar gaData nist, ye matn "Loading" neshan bede
    if (!gamesData || !userData) {
        return <div>Loading...</div>;
    }
    if (gameId == 0 || !gameData) {
        return (
            <div id="scale">
            <ul className="tilesWrap">
                {gamesData.map(function (game, i) {
                    var _players = game.players.filter((player) => player.nickname).length;
                    //console.log(_players);

                    return (
                        <li onClick={() => setGameId(game.id)} key={i}>
                            <h2>
                                {_players}/{game.seats}
                            </h2>
                            <h3>{game.id}</h3>
                            <p>
                                Min Bet: {doCurrencyMil(game.min * 1000)}
                                <br />
                                Max Bet: {doCurrencyMil(game.min * 10000)}
                            </p>
                            <button>Join Now</button>
                        </li>
                    );
                })}
            </ul></div>
        );
    }
    {gameData.players.map(function (player, pNumber) {
        if (player.nickname == userData.nickname) {
            _countBet = _countBet + 1;
            _totalBet = _totalBet + player.bet;
            _totalWin = _totalWin + player.win;
        }
    })}
    return (
        <div id="scale">
            <div id="game-room" style={{}}>
                <div id="dark-overlay"></div>

                <div id="table-graphics"></div>

                <button id="leave-button" onClick={() => setGameId(0)}>
                    <i className="fas fa-sign-out-alt"></i> EXIT {gameId}
                </button>
                <div id="balance-bet-box">
                    <div className="balance-bet">
                        Balance
                        <div id="balance">{doCurrency(userData.balance)}</div>
                    </div>
                    <div className="balance-bet">
                        Total Bet
                        <div id="total-bet">{doCurrency(_totalBet)}</div>
                    </div>
                    <div className="balance-bet">
                        Total Win
                        <div id="total-bet">{doCurrency(_totalWin)}</div>
                    </div>
                </div>
                <div id="volume-button">
                    <i className="fas fa-volume-up"></i>
                </div>
                {gameData.startTimer >= 0 && (
                    <div id="deal-start-label" className="hide-element">
                        <p>
                            Waiting for bets <span id="seconds">{gameData.startTimer + 1}</span>
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
                                    var _dClass = "animate__flipInY";
                                    if (i == 1) {
                                        _dClass = "animate__flipInY";
                                    }
                                    return (
                                        <span key={i} className={_dClass + " animate__animated   dealerCardImg"}>
                                            <img className={" animate__animated dealerCardImg"} src={"/imgs/" + card.suit + card.value.card + ".svg"} />
                                        </span>
                                    );
                                })}
                                {gameData.dealer?.cards.length == 1 && (
                                    <>
                                        {gameData.dealer?.hiddencards.map(function (card, i) {
                                            var _dClass = "animate__flipInY";

                                            return (
                                                <span key={i} className={_dClass + " animate__animated   dealerCardImg"}>
                                                    <img className={" animate__animated dealerCardImg"} src={"/imgs/" + card.suit + card.value.card + ".svg"} />
                                                </span>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div id="players-container">
                    
                    {gameData.players.map(function (player, pNumber) {
                        var _resClass = "";
                        var _resCoinClass = "animate__slideInDown";
                        var _res = "";
                        if (gameData.dealer?.sum >= 17 && gameData.dealer?.sum <= 21) {
                            if (gameData.dealer?.sum > player.sum) {
                                _res = "LOSE";
                                _resClass = "result-lose";
                                _resCoinClass = "animate__delay-1s animate__backOutUp animate__repeat-3";
                            }
                            if (gameData.dealer?.sum < player.sum) {
                                _res = "WIN";
                                _resClass = "result-win";
                                _resCoinClass = "animate__delay-2s animate__bounceOutDown";
                            }
                            if (gameData.dealer?.sum == player.sum) {
                                _res = "DRAW";
                                _resClass = "result-draw";
                            }
                        }
                        if (gameData.dealer?.sum > 21) {
                            _res = "WIN";
                            _resClass = "result-win";
                            _resCoinClass = "animate__delay-2s animate__bounceOutDown";
                        }
                        if (player.sum > 21) {
                            _res = "🔥";
                            _resClass = "result-lose result-bust";
                            _resCoinClass = "animate__delay-1s animate__bounceOutUp animate__repeat-3";
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
                            <span className={player.bet ? "players " + _resClass : "players "} key={pNumber}>
                                {!player?.nickname ? (
                                    <>
                                        <div className={gameData.gameOn || gameData.min * 1000 > userData.balance || _countBet >= 3 ? "empty-slot noclick" : "empty-slot"} onClick={() => socket.send(JSON.stringify({ method: "join", theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                            <i className="fas fa-user-plus"></i>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {!gameData.gameOn && !player.bet && player.nickname == userData.nickname && (
                                            <div id="bets-container">
                                                <span>
                                                    <button className="betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp" id={"chip"} onClick={() => socket.send(JSON.stringify({ method: "leave", gameId: gameData.id, seat: pNumber }))}>
                                                        X
                                                    </button>
                                                </span>
                                                {_renge.map(function (bet, i) {
                                                    if (bet * 1000 <= userData.balance) {
                                                        return (
                                                            <span key={i}>
                                                                <button className="betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp" id={"chip" + i} value={bet * 1000} onClick={() => socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                                                    {doCurrencyMil(bet * 1000)}
                                                                </button>
                                                            </span>
                                                        );
                                                    } else {
                                                        return (
                                                            <span key={i}>
                                                                <button className="betButtons update-balance-bet noclick noclick-nohide animate__faster animate__animated animate__zoomInUp" id={"chip" + i} value={bet * 1000} onClick={() => socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }))}>
                                                                    {doCurrencyMil(bet * 1000)}
                                                                </button>
                                                            </span>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        )}
                                        {!gameData.gameOn && player.bet > 0 && (
                                            <>
                                                {/* <div id="bets-container-right">
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
                                                </div> */}
                                            </>
                                        )}
                                        {gameData.gameOn && gameData.currentPlayer == pNumber && player.nickname == userData.nickname && player.cards.length >= 2 && player.sum < 21 ? (
                                            <div className="user-action-container  animate__slideInUp animate__animated">
                                                <div id="your-turn-label">MAKE A DECISION {gameData.timer + 1}</div>

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
                                                {player.cards.length == 2 && userData.balance >= player.bet && (
                                                    <div className="user-action-box  hide-element">
                                                        <button className="user-action" id="doubleDown" onClick={() => socket.send(JSON.stringify({ method: "double", gameId: gameData.id, seat: pNumber }))}>
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

                                        {player.sum > 0 && <div className={gameData.currentPlayer == pNumber ? "current-player-highlight player-sum" : "player-sum " + _resClass}>{player.sum}</div>}
                                        {player.bet > 0 ? (
                                            <div className={"player-coin animate__animated "}>
                                                {player.isDouble ? (
                                                    <>
                                                        <button className="betButtons update-balance-bet" id={"chip" + _renge.findIndex((bet) => bet == player.bet / 2000)}>
                                                            {doCurrencyMil(player.bet)}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="betButtons update-balance-bet" id={"chip" + _renge.findIndex((bet) => bet == player.bet / 1000)}>
                                                        {doCurrencyMil(player.bet)}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="player-coin animate__flipInX animate__animated">
                                                <img className="player-avatar" src={"/imgs/avatars/" + player.avatar + ".png"} alt="avatar" />
                                            </div>
                                        )}
                                        {_res && <div className={"player-result " + _resClass}>{_res}</div>}

                                        <div className="player-cards">
                                            {player.cards.map(function (card, i) {
                                                return (
                                                    <span key={i} className={" animate__animated animate__slideInDown  cardImg"}>
                                                        <img className={player.isDouble && i == 2 ? "   isdouble  cardImg card" + (i + 1) : "  animate__animated cardImg card" + (i + 1)} src={"/imgs/" + card.suit + card.value.card + ".svg"} />
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                                <div id="players-timer-container">
                                    <svg className="players-timer">
                                        <circle className={gameData.currentPlayer == pNumber && player?.nickname && gameData.gameOn ? "circle-animation" : ""} cx="48.5" cy="48.5" r="45" strokeWidth="4" fill="transparent" />
                                    </svg>
                                </div>
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlackjackGame;
