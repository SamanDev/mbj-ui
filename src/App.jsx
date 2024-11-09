import React, { useState, useEffect } from "react";
import $ from "jquery";
import Info from "./components/Info";
import Loader from "./components/Loader";
import { Howl } from "howler";

let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1];
}
//_auth = "farshad-HangOver2";
//console.log(_auth);

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
const haveSideBet = (sideBets, nickname, seat, mode) => {
    var _have = false;
    sideBets
        .filter((sideBet) => sideBet?.seat == seat && sideBet?.mode == mode && sideBet?.nickname == nickname)
        .map(function (bet) {
            _have = bet.amount;
        });
    return _have;
};
const AppOrtion = () => {
    var gWidth = $("#root").width() / 1400;

    var scale = gWidth;
    var highProtect = $("#root").height() * scale;

    if (highProtect > 850) {
        var gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
        scale = gHight;
        if (scale <= 1) {
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        }
    } else {
        var gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
        scale = gHight;
        if (scale <= 1) {
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        }
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

window.addEventListener(
    orientationEvent,
    function () {
        AppOrtion();
    },
    false
);
window.parent.postMessage("userget", "*");

if (window.self == window.top) {
    window.location.href = "https://www.google.com/";
}
let dealingSound = new Howl({
    src: ["/sounds/dealing_card_fix3.mp3"],
    volume: 0.5,
});
let chipHover = new Howl({
    src: ["/sounds/chip_hover_fix.mp3"],
    volume: 0.1,
});
let chipPlace = new Howl({
    src: ["/sounds/chip_place.mp3"],
    volume: 0.1,
});
let actionClick = new Howl({
    src: ["/sounds/actionClick.mp3"],
    volume: 0.1,
});
let defaultClick = new Howl({
    src: ["/sounds/click_default.mp3"],
    volume: 0.1,
});
let clickFiller = new Howl({
    src: ["/sounds/click_filler.mp3"],
    volume: 0.1,
});
let timerRunningOut = new Howl({
    src: ["/sounds/timer_running_out.mp3"],
    volume: 0.5,
});

// let youWin = new Howl({
//   src: ['/sounds/you_win.mp3']
// });
// let youLose = new Howl({
//   src: ['/sounds/you_lose.mp3']
// });

const BlackjackGame = () => {
    var _countBet = 0;

    var _totalBet = 0;
    var _totalWin = 0;
    const [gamesData, setGamesData] = useState([]);
    const [gameData, setGameData] = useState(null); // Baraye zakhire JSON object
    const [userData, setUserData] = useState(null);

    const [conn, setConn] = useState(true);
    const [gameId, setGameId] = useState(0);
    const [gameTimer, setGameTimer] = useState(-1);

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
                if (data.theClient?.balance >= 0) {
                    setUserData(data.theClient);
                } else {
                    setUserData(data.theClient);
                   // setConn(false);
                    //_auth = null;
                }
                // Update kardan state
            }
            if (data.method == "timer") {
                if (data.gameId == $("#gameId").text()) {
                    if(data.sec==5){
                        timerRunningOut.play();
                    }
                    setGameTimer(data.sec); // Update kardan state
                }
            }
            if (data.method == "deal") {
                if (data.gameId == $("#gameId").text()) {
                    dealingSound.play()
                }
            }
            
        };

        // Event onclose baraye vaghti ke websocket baste mishe
        socket.onclose = () => {
            console.log("WebSocket closed");
            setConn(false);
            _auth = null;
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
                $("body").css("background", "radial-gradient(#388183, #1e3d42)").removeAttr("class").addClass("tabl1");
            }
            if (gameId == gamesData[1].id) {
                $("body").css("background", "radial-gradient(#837538, #423e1e)").removeAttr("class").addClass("tabl2");
            }
            if (gameId == gamesData[2].id) {
                $("body").css("background", "radial-gradient(#723883, #1e2b42)").removeAttr("class").addClass("tabl3");
            }
            if (gameId == gamesData[3].id) {
                $("body").css("background", "radial-gradient(#833838, #421e1e)").removeAttr("class").addClass("tabl4");
            }
        }
    }, [gameId]);
    useEffect(() => {
        setTimeout(() => {
            $(".tilesWrap li").hover(
                function () {
                    defaultClick.play();
                },
                function () {
                    // play nothing when mouse leaves chip
                }
            );
            $(".empty-slot i").hover(
                function () {
                    // console.log('hi');

                    actionClick.play();
                },
                function () {
                    // play nothing when mouse leaves chip
                }
            );
            $(".betButtons").hover(
                function () {
                    // console.log('hi');

                    chipHover.play();
                },
                function () {
                    // play nothing when mouse leaves chip
                }
            );
           
            
        }, 10);
        
        if (gamesData.length && gameId != 0) {
            var _data = gamesData.filter((game) => game?.id === gameId)[0];
            //console.log(_data);

            setGameData(_data);
            if (_data.dealer?.cards.length > 1) {
                setGameTimer(-1);
            }
        }
        if ( gameId == 0) {
            setGameData(null)
                setGameTimer(-1);
            
        }
        AppOrtion();
    }, [gamesData, gameId]);
    // Agar gaData nist, ye matn "Loading" neshan bede
    if (_auth == null || !conn) {
        return <Loader errcon={true} />;
    }
    if (!gamesData || !userData) {
        return <Loader />;
    }

    if (gameId == 0 || !gameData) {
        return (
            <div>
                <ul className="tilesWrap" id="scale">
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
                </ul>
            </div>
        );
    }
    {
        gameData.players.map(function (player, pNumber) {
            if (player.nickname == userData.nickname) {
                _countBet = _countBet + 1;
                _totalBet = _totalBet + player.bet;
                _totalWin = _totalWin + player.win;
            }
        });
        gameData.sideBets.map(function (player, pNumber) {
            if (player.nickname == userData.nickname) {
                _totalBet = _totalBet + player.amount;
                _totalWin = _totalWin + player.win;
            }
        });
    }
    return (
        <div>
            <div className="game-room" id="scale">
                <div id="dark-overlay"></div>

                <div id="table-graphics"></div>

                <Info setGameId={setGameId} gameId={gameId} />
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
                {gameTimer >= 0 && !gameData.gameOn && (
                    <div id="deal-start-label" className="hide-element">
                        <p>
                            Waiting for bets <span>{gameTimer}</span>
                        </p>
                    </div>
                )}

                <div id="dealer">
                    <h1>DEALER</h1>
                    {gameData.dealer?.sum>0 && <div id="dealerSum">{gameData.dealer?.sum}</div>}
                    {gameData.dealer?.cards.length>0 && (
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
                        if (gameData.dealer?.sum >= 17 && gameData.dealer?.sum <= 21  &&gameData.dealer?.hasLeft) {
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
                        if (gameData.dealer?.sum > 21 &&gameData.dealer?.hasLeft) {
                            _res = "WIN";
                            _resClass = "result-win";
                            _resCoinClass = "animate__delay-2s animate__bounceOutDown";
                        }
                        if (player.sum > 21) {
                            _res = "🔥";
                            _resClass = "result-lose result-bust";
                            _resCoinClass = "animate__delay-1s animate__bounceOutUp animate__repeat-3";
                        }
                        if (player.blackjack && gameData.dealer?.sum!=21) {
                            _res = "BJ";
                            _resClass = "result-blackjack";
                        }
                        var _renge = [gameData.min];
                        _renge.push(_renge[0] * 2);
                        _renge.push(_renge[0] * 5);
                        _renge.push(_renge[0] * 10);
                        var sidePP = haveSideBet(gameData.sideBets, userData.nickname, pNumber, "PerfectPer");
                        var sidePPPlayer = haveSideBet(gameData.sideBets, player.nickname, pNumber, "PerfectPer");

                        var side213 = haveSideBet(gameData.sideBets, userData.nickname, pNumber, "21+3");
                        var side213layer = haveSideBet(gameData.sideBets, player.nickname, pNumber, "21+3");

                        return (
                            <span className={player.bet ? (gameData.currentPlayer == pNumber && gameData.gameOn ? "players curplayer" : "players " + _resClass) : "players"} key={pNumber} id={"slot"+pNumber}>
                                {!player?.nickname ? (
                                    <>
                                        <div className={gameData.gameOn || gameData.min * 1000 > userData.balance || _countBet >= 3 || (gameTimer < 2 && gameData.gameStart)? "empty-slot noclick" : "empty-slot"} onClick={() => { clickFiller.play();socket.send(JSON.stringify({ method: "join", theClient: userData, gameId: gameData.id, seat: pNumber }))}}>
                                            <i className="fas fa-user-plus"></i>
                                        </div>
                                       
                                    </>
                                ) : (
                                    <>
                                        {!gameData.gameOn && !player.bet && player.nickname == userData.nickname && (
                                            <div id="bets-container">
                                                <span className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                    <button className="betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp" id={"chip"} onClick={() => socket.send(JSON.stringify({ method: "leave", gameId: gameData.id, seat: pNumber }))}>
                                                        X
                                                    </button>
                                                </span>
                                                {_renge.map(function (bet, i) {
                                                    if (bet * 1000 <= userData.balance) {
                                                        return (
                                                            <span key={i}  className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                                <button className="betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp" id={"chip" + i} value={bet * 1000} onClick={() => {$('#slot'+pNumber+' .betButtons').addClass('noclick-nohide animate__zoomOut animate__animated');chipPlace.play();socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }))}}>
                                                                    {doCurrencyMil(bet * 1000)}
                                                                </button>
                                                            </span>
                                                        );
                                                    } else {
                                                        return (
                                                            <span key={i}  className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                                <button className="betButtons update-balance-bet noclick noclick-nohide animate__faster animate__animated animate__zoomInUp" id={"chip" + i} value={bet * 1000}>
                                                                    {doCurrencyMil(bet * 1000)}
                                                                </button>
                                                            </span>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        )}
                                        {player.bet > 0 && (
                                            <>
                                                <div id="bets-container-left">
                                                    {_renge.map(function (bet, i) {
                                                        if (i < 2) {
                                                            return (
                                                                <span key={i} style={gameData.gameOn?{opacity:0}:{opacity:1}} className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                                    <button
                                                                        className={gameData.gameOn ? "betButtons update-balance-bet noclick animate__faster animate__animated animate__fadeOutDown" : sidePP ? "betButtons update-balance-bet noclick animate__faster animate__animated animate__fadeOutDown" : bet * 1000 > userData.balance || bet * 1000 > player.bet ? "betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp noclick" : "betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp"}
                                                                        id={"chip" + i}
                                                                        value={bet * 1000}
                                                                        onClick={() => {$('#slot'+pNumber+'  #bets-container-left .betButtons:not(.place)').addClass('noclick-nohide animate__zoomOut animate__animated');chipPlace.play();socket.send(JSON.stringify({ method: "sidebet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber, mode: "PerfectPer" }))}}
                                                                    >
                                                                        {doCurrencyMil(bet * 1000)}
                                                                    </button>
                                                                </span>
                                                            );
                                                        }
                                                    })}

                                                    <span className={player?.sideppx > 0 ? "winner" : ""}>
                                                        {player?.sideppx > 0 && <div className="bets-side-win animate__animated animate__fadeInUp">x{player?.sideppx}</div>}
                                                        {sidePP ? (
                                                            <>
                                                                <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == sidePP / 1000)}>
                                                                    {doCurrencyMil(sidePP)}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {sidePPPlayer ? (
                                                                    <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == sidePPPlayer / 1000)}>
                                                                        {doCurrencyMil(sidePPPlayer)}
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={()=>$('#sidebetbtn').trigger('click')} className={player?.sideppx > 0 ? "betButtons place winner update-balance-bet animate__faster animate__animated animate__zoomInUp noclick" : "betButtons place update-balance-bet animate__faster animate__animated animate__zoomInUp noclick"}>
                                                                        Perfect
                                                                        <br />
                                                                        Pairs
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <div id="bets-container-right">
                                                    {_renge.map(function (bet, i) {
                                                        if (i < 2) {
                                                            return (
                                                                <span key={i}  className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                                    <button
                                                                        className={gameData.gameOn ? "betButtons update-balance-bet noclick animate__faster animate__animated animate__fadeOutDown" : side213 ? "betButtons update-balance-bet noclick animate__faster animate__animated animate__fadeOutDown" : bet * 1000 > userData.balance || bet * 1000 > player.bet ? "betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp noclick" : "betButtons update-balance-bet animate__faster animate__animated animate__zoomInUp"}
                                                                        id={"chip" + i}
                                                                        value={bet * 1000}
                                                                        onClick={() => {$('#slot'+pNumber+' #bets-container-right .betButtons:not(.place)').addClass('noclick-nohide animate__zoomOut animate__animated');chipPlace.play();socket.send(JSON.stringify({ method: "sidebet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber, mode: "21+3" }))}}
                                                                    >
                                                                        {doCurrencyMil(bet * 1000)}
                                                                    </button>
                                                                </span>
                                                            );
                                                        }
                                                    })}
                                                    <span className={player?.side213x > 0 ? "winner" : ""}>
                                                        {player?.side213x > 0 && <div className="bets-side-win animate__animated animate__fadeInUp">x{player?.side213x}</div>}
                                                        {side213 ? (
                                                            <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == side213 / 1000)}>
                                                                {doCurrencyMil(side213)}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                {side213layer ? (
                                                                    <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == side213layer / 1000)}>
                                                                        {doCurrencyMil(side213layer)}
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={()=>$('#sidebetbtn').trigger('click')}  className={player?.side213x > 0 ? "betButtons place winner animate__faster animate__animated animate__zoomInUp" : "betButtons place update-balance-bet animate__faster animate__animated animate__zoomInUp noclick"}>
                                                                        21
                                                                        <br />+ 3
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {gameData.gameOn  && gameData.dealer.hiddencards.length > 0&& gameData.currentPlayer == pNumber && player.nickname == userData.nickname && player.cards.length >= 2 && player.sum < 21 ? (
                                            <div className="user-action-container  animate__slideInUp animate__animated">
                                                <div id="your-turn-label">MAKE A DECISION {gameTimer >= 0 && <span>{gameTimer}</span>}</div>

                                                <div className="user-action-box">
                                                    <button className="user-action" id="stand" onClick={() => {$('.user-action').addClass('noclick-nohide');socket.send(JSON.stringify({ method: "stand", gameId: gameData.id, seat: pNumber }))}}>
                                                        <i className="fas fa-hand-paper"></i>
                                                    </button>
                                                    <div className="user-action-text">STAND</div>
                                                </div>
                                                <div className="user-action-box">
                                                    <button className="user-action" id="hit" onClick={() => {socket.send(JSON.stringify({ method: "hit", gameId: gameData.id, seat: pNumber }))}}>
                                                        <i className="fas fa-hand-pointer"></i>
                                                    </button>
                                                    <div className="user-action-text">HIT</div>
                                                </div>
                                                {player.cards.length == 2 && userData.balance >= player.bet && (
                                                    <div className="user-action-box  hide-element">
                                                        <button className="user-action" id="doubleDown" onClick={() => {$('.user-action').addClass('noclick-nohide');socket.send(JSON.stringify({ method: "double", gameId: gameData.id, seat: pNumber }))}}>
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
                                            <div className={"player-coin"}>
                                                {player.isDouble ? (
                                                    <>
                                                        <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == player.bet / 2000)}>
                                                            {doCurrencyMil(player.bet)}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == player.bet / 1000)}>
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
                                        <circle className={gameData.currentPlayer == pNumber && player?.nickname && gameData.gameOn && player?.sum < 21&&player?.bet > 0  && player.cards.length >= 2 && gameData.dealer.hiddencards.length > 0 ? "circle-animation" : ""} cx="48.5" cy="48.5" r="45" strokeWidth="10" fill="transparent"   />
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
