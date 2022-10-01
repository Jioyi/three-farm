import React from 'react';
// Style css
import Styles from './Game.module.css';
// EngineGame
import EngineGame from '../../EngineGame';
// Components
import Loading from '../../Components/Loading';

const Game = () => {
    const sceneCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const started = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(0);

    const eventGameHandler = ({ type, data }: any) => {
        switch (type) {
            case 'loading':
                setLoading(data);
                break;
            case 'progress':
                setProgress(data);
                break;
        }
    };

    React.useLayoutEffect(() => {
        if (sceneCanvasRef.current && !started.current) {
            started.current = true;
            new EngineGame(sceneCanvasRef.current, eventGameHandler);
        }
    }, []);

    return (
        <div className={Styles['container']}>
            <canvas ref={sceneCanvasRef} className={Styles['game-canvas']} />
            <Loading loading={loading} progress={progress} />
        </div>
    );
};

export default Game;
