import React, {Component} from 'react';
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker,Polyline, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import carIcon from '../img/car5.png';

let DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize:    [25, 46],
    iconAnchor:  [12, 46]
});
Leaflet.Marker.prototype.options.icon = DefaultIcon;

const CarIcon =   new Leaflet.Icon({
    iconUrl: carIcon,
    iconSize:    [45, 45],
    iconAnchor:  [12, 20]
});
export {CarIcon};

const blueOptions = { color: 'blue' }

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lat: 48.09339596402731,
            lng: 11.41176602942872,
            driverList: []
        };
    }

    async componentDidMount(){
        this.getDrivers();

        // set Interval
        this.interval = setInterval(this.getDrivers, 5000);
    }
    async componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.interval);
    }
    getDrivers = () => {
        fetch('http://localhost:8080/drivers').then(async response => {
            const data = await response.json();
            this.setState({driverList : data});
        });
    }
    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <MapContainer center={position} zoom={6} scrollWheelZoom={true} style={{ height: "935px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.driverList.map((driver) => (
                    <div>
                        <div>
                            <Marker icon={CarIcon} position={driver.location}>
                                <Popup>
                                    Name: {driver.driverName} <br />
                                    City: {driver.driverCityOrigin}<br />
                                    Info: {driver.driverInfo}<br />
                                    Language: {driver.driverLanguage}<br />
                                    Phone: {driver.driverPhone }<br />
                                    KM: {driver.kmDriven   }<br />
                                    License Plate: {driver.licensePlate}<br />
                                </Popup>
                            </Marker>
                        </div>
                        <div>
                            <Polyline pathOptions={blueOptions} positions={driver.locationHistory}/>
                        </div>
                    </div>
       ))}
            </MapContainer>
        );
    }
}