import React from 'react';
import './Drawer.css';

class Drawer extends React.Component {
    render() {
        let drawerClass = 'side-drawer'
        if (this.props.show) {
            drawerClass = 'side-drawer open'
        }
        return (
            <div className={drawerClass}>
                <h1>Game history</h1>
                <div className="game-info"> 
                    <ul>{this.props.moves}</ul>
                </div>
            </div>
        )
    }

}

export default Drawer;
