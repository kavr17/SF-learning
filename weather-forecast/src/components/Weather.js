import * as React from "react";
import Table from "react-bootstrap/Table";

import "../styles/Weather.css"

const API_KEY = "b92b550588b6a8a0b2f8e15ee5acab64"

class Weather extends React.Component {
    render() {
        return (
            <>
                <Table>
                    { this.props.city &&
                        <>
                            <thead>{this.props.city} ({this.props.country})</thead>
                            <tbody>
                            <tr>
                                <td>Температура: {Math.round(this.props.temp)} °С</td>
                            </tr>
                            <tr>
                                <td>Ощущается: {Math.round(this.props.feels_like)} °С</td>
                            </tr>
                            <tr>
                                <td>Скорость ветра: {this.props.wind} m/s</td>
                            </tr>
                            </tbody>
                        </>
                    }
                </Table>

            </>
        );
    }
}

export default Weather;
