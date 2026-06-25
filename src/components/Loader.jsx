import { Dimmer, Loader, Icon, IconGroup } from "semantic-ui-react";

const LoaderExampleLoader = (prop) => {
    return(<div><div className="game-room" id="scale">
        <Dimmer active className="myloading">
            {prop.errcon ? (
                <div>
                    <IconGroup size="huge" style={{ marginTop: "10%" }}>
                        <Icon color="grey" name="internet explorer" inverted />
                        <Icon size="big" color="red" name="dont" />
                    </IconGroup>
                    <br />
                    <br />
                    <br />
                    <br />
                    <strong>Game Offline</strong>
                    <br />
                    Server is not available right now. Please try again later.
                </div>
            ) : (
                <Loader size="huge" />
            )}
        </Dimmer>
    </div></div>)};

export default LoaderExampleLoader;
