
const Card = () => {
    
    return (
        <div className="card-0 up" id="pcard-0">
            <span className="pos-0 black">
                <span className="rank">K</span>
                <span className="suit">♠</span>
            </span>
            <span className="pos-1 black">
                <span className="rank">K</span>
                <span className="suit">♠</span>
            </span>
            <div className="popover left in">
                <div className="arrow"></div>
                <h3 className="popover-title">You Have</h3>
                <div className="popover-content">19</div>
            </div>
        </div>
    );
};

export default Card;
