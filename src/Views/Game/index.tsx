import React from 'react';
// Style css
import Styles from './Game.module.css';
// EngineGame
import EngineGame from '../../EngineGame';
// Components
import Loading from '../../Components/Loading';
import Portal from '../../Components/Portal';
import Calendar from '../../Components/Calendar';
import GameMap from '../../Components/GameMap';
import Avatar from '../../Components/Avatar/index';
import ResourcesBar from '../../Components/ResourcesBar';
import MenuSettings from '../../Components/MenuSettings';
import Store from '../../Components/Store';
import Customize from '../../Components/Customize';
// Contexts
import { useUserContext } from '../../Contexts';
import MiniCalendar from '../../Components/MiniCalendar';

const Game = () => {
    const {
        toggleStore,
        toggleCalendar,
        toggleGameMap,
        openStore,
        openCalendar,
        openGameMap,
        setEngine,
        loading,
        progress,
        eventGameHandler,
        toggleSettings,
        openSettings,
        openCustomize,
        toggleCustomize
    } = useUserContext();

    const sceneCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const started = React.useRef(false);

    React.useEffect(() => {
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
            {!loading && (
                <>
                    <ResourcesBar />
                    <Avatar />
                    <MiniCalendar />
                    <Portal element={<Store />} onClose={toggleStore} open={openStore} />
                    <Portal element={<Calendar />} onClose={toggleCalendar} open={openCalendar} />
                    <Portal element={<GameMap />} onClose={toggleGameMap} open={openGameMap} />
                    <Portal element={<MenuSettings />} onClose={toggleSettings} open={openSettings} />
                    <Portal element={<Customize />} onClose={toggleCustomize} open={openCustomize} />
                </>
            )}
        </div>
    );
};

export default Game;
