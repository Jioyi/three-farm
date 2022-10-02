import React from 'react';
// Style css
import Styles from './Game.module.css';
// EngineGame
import EngineGame from '../../EngineGame';
// Components
import Loading from '../../Components/Loading';
import GameNavbar from '../../Components/GameNavbar';
// Contexts
import { useUserContext } from '../../Contexts';
import ResourcesBar from '../../Components/ResourcesBar';

const Game = () => {
    const { setEngine } = useUserContext();
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
            const engine = new EngineGame(sceneCanvasRef.current, eventGameHandler);
            setEngine(engine);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={Styles['container']}>
            <canvas ref={sceneCanvasRef} className={Styles['game-canvas']} />
            <Loading loading={loading} progress={progress} />
            <ResourcesBar />
            <GameNavbar />
        </div>
    );
};

export default Game;
