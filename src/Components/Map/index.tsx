import React, { useState } from 'react';
import { mapSlot } from './mapSlot.js';
import Styles from './Map.module.css';

const Map = () => {
    const [slots, setSlots] = useState(mapSlot);
    const [actualSlot, setActualSlot] = useState({
        x: 11,
        y: 11
    });
    const vender = () => {
        if (!slots[actualSlot.x][actualSlot.y].free) {
            let newArray = slots;
            newArray[actualSlot.x].fill({ free: true }, actualSlot.y, actualSlot.y + 1);
            setSlots(newArray);
        }
    };
    const comprar = () => {
        if (slots[actualSlot.x][actualSlot.y].free) {
            let newArray = slots;
            newArray[actualSlot.x].fill({ free: false }, actualSlot.y, actualSlot.y + 1);
            setSlots(newArray);
        }
    };
    return (
        <div className={Styles['container']}>
            <p>Propiedades</p>
            <div className={Styles['effect3D-border']}>
                <div className={Styles['effect3D']}>
                    <div className={Styles['map']}>
                        {slots.map((listSlot, x) => {
                            return listSlot.map((slot, y) => {
                                return (
                                    <div
                                        onClick={() => setActualSlot({ x, y })}
                                        key={`coord${x}-${y}`}
                                        className={Styles[`slot${actualSlot.x === x && actualSlot.y === y ? 2 : slot.free ? 1 : 0}`]}
                                    ></div>
                                );
                            });
                        })}
                    </div>
                </div>
            </div>
            <p>
                seleccion actual: coord({actualSlot.x + 1},{actualSlot.y + 1})
            </p>
            <button className={Styles['btn']} onClick={vender}>
                vender
            </button>
            <button className={Styles['btn']} onClick={comprar}>
                comprar
            </button>
        </div>
    );
};

export default Map;
