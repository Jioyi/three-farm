import EngineGame from '..';
import { Day } from '../interfaces';

export class CalendarController {
    private _engine: EngineGame;
    private _paused: boolean = false;

    private _calendar: Date;
    private _speedGame: number = 1;
    private _day: number = 0;
    private _time!: NodeJS.Timeout;

    private _eventGameHandler: (...args: any[]) => any;

    private _forecast: Day[] = [];

    constructor(_engine: EngineGame, _eventGameHandler: (...args: any[]) => any) {
        this._engine = _engine;
        this._eventGameHandler = _eventGameHandler;
        this._calendar = new Date();
        this._calculateForecast(true);
        this._eventGameHandler({ type: 'setForecast', data: this._forecast });
    }

    public start = () => {
        this._time = setTimeout(this._addDay, 5000 * this._speedGame);
    };

    private _addDay = () => {
        this._day += 1;
        this._calendar.setDate(this._calendar.getDate() + 1);
        this._forecast.splice(0, 1);
        if (this._forecast.length < 10) this._calculateForecast(false);
        this._eventGameHandler({ type: 'setForecast', data: [...this._forecast] });
        this._engine.updateCropsAndAnimals();
        this._time = setTimeout(this._addDay, 1000 * this._speedGame);
    };

    private _calculateForecast = async (_bool: boolean) => {
        let d2 = this._forecast.length * 86400000;
        for (let i = _bool ? 0 : 1; i < 30; i++) {
            let d = 86400000 * i;
            const newDate = new Date(this._calendar.getTime() + d + d2);
            const month = newDate.getMonth();
            let temperature = 0;
            if (month === 8 || month === 9 || month === 10) {
                //AUTUMN (otoño)
                temperature = this._getRandomTemperature(50, 90);
            } else if (month === 11 || month === 0 || month === 1) {
                //WINTER (invierno)
                temperature = this._getRandomTemperature(-20, 35);
            } else if (month === 2 || month === 3 || month === 4) {
                //SPRING (primavera)
                temperature = this._getRandomTemperature(-35, 70);
            } else {
                temperature = this._getRandomTemperature(65, 100);
            }
            const week = this._getWeekOfMonth(newDate, false);
            const day: Day = {
                year: newDate.getFullYear(),
                month: newDate.getMonth(),
                weekday: newDate.getDay(),
                day: newDate.getDate(),
                temperature: temperature,
                humidity: 30,
                climate: Math.floor(Math.random() * 3),
                week: week
            };
            this._forecast.push(day);
        }
    };

    private _getRandomTemperature(minTemperature: number, maxTemperature: number) {
        minTemperature = Math.ceil(minTemperature);
        maxTemperature = Math.floor(maxTemperature);
        return Math.floor(Math.random() * (maxTemperature - minTemperature) + minTemperature);
    }

    private _getWeekOfMonth = (_date: Date, _exact: boolean) => {
        let month = _date.getMonth();
        let year = _date.getFullYear();
        let firstWeekday = new Date(year, month, 1).getDay();

        let lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        let offsetDate = _date.getDate() + firstWeekday - 1;
        let index = 1; // start index at 0 or 1, your choice
        let weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7);

        let week = index + Math.floor(offsetDate / 7);
        if (_exact || week < 2 + index) return week;
        return week === weeksInMonth ? index + 5 : week;
    };
}
