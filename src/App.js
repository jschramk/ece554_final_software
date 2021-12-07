import "./App.css";
import React from "react";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.minSliderPow = 5;
        this.maxSliderPow = 10;

        let initalSliderValues = new Array(this.maxSliderPow - this.minSliderPow + 1);

        for (let i = 0; i < initalSliderValues.length; i++) {
            initalSliderValues[i] = 50;
        }

        this.state = {
            duration: 0,
            pitchShiftSemitones: 0,
            sliderValues: initalSliderValues,
            sectionIndex: -1,
            sections: [],
        }

    }

    getSections() {

        let elements = [];

        for (let i = 0; i < this.state.sections.length; i++) {

            let section = this.state.sections[i];

            elements.push(<div
                style={{
                    border: "1px solid black", padding: 10, marginBottom: 5, cursor: "pointer"
                }}
                onClick={() => this.setState(prevSate => {

                    return { sliderValues: [...section.sliderValues], sectionIndex: i }

                })}>
                {"Section " + i}
            </div>)

        }

        return elements;

    }

    getSliders(startPow, endPow) {

        if (endPow < startPow) {
            console.error("endPow must be greater than startPow");
            return;
        }

        let elements = [];

        for (let i = 0; i < endPow - startPow + 1; i++) {

            let freq = Math.pow(2, startPow + i);

            elements.push(<div style={{ width: 50, display: "inline-block" }}>
                <input
                    type="range"
                    orient="vertical"
                    min={0}
                    max={100}
                    value={this.state.sliderValues[i]}
                    style={{ display: "block", width: "100%", marginBottom: 10 }}
                    onInput={e => {
                        this.setState(prevState => {

                            let sliderValues = [...prevState.sliderValues];

                            sliderValues[i] = e.target.value;

                            return { sliderValues };

                        });
                    }}
                />
                <div style={{ width: "100%", textAlign: "center" }}>{freq}</div>
            </div>);

        }

        return elements;

    }

    getSemitoneSelect(min, max) {

        let elements = [];

        for (let i = min; i <= max; i++) {

            elements.push(<option value={i} selected={i === this.state.pitchShiftSemitones}>{i}</option>)

        }

        return <select
            style={{ width: 50 }}
            onChange={e => this.setState({ pitchShiftSemitones: e.target.value })}
        >
            {elements}
        </select>;

    }

    render() {

        return <div style={{ display: "flex", width: "100%", height: "100%" }}>

            <div style={{ flex: 1, height: "100%", padding: 10 }}>

                <div>
                    <h2>{this.state.sectionIndex >= 0 ? `Section ${this.state.sectionIndex} Parameters` : "No Section Selected"}</h2>
                </div>

                <div style={{ marginBottom: 10 }}>
                    {this.getSliders(this.minSliderPow, this.maxSliderPow)}
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>Pitch Shift Semitones</label>
                    <br />
                    {this.getSemitoneSelect(-12, 12)}
                </div>

                <button
                    onClick={() => {

                        if(this.state.sectionIndex < 0) {
                            alert("Please select a section to modify.");
                            return;
                        }

                    }}
                >Save Parameters</button>


            </div>

            <div style={{ width: 400, height: "100%", display: "flex", flexDirection: "column" }}>

                <div style={{ width: "100%", height: 50, backgroundColor: "red" }}>

                    <button
                        style={{ margin: "auto", width: "100%" }}
                        onClick={() => this.setState(prevState => {

                            let sections = [...prevState.sections];

                            let newSection = {
                                sliderValues: [...this.state.sliderValues]
                            }

                            sections.push(newSection);

                            return { sections };

                        })}>Add Section</button>

                </div>

                <div style={{ width: "100%", flex: 1, overflow: "auto" }}>

                    {this.getSections()}

                </div>

            </div>

        </div>
    }
}

export default App;
