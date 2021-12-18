import "./App.css";
import React from "react";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.minSliderPow = 5;
        this.maxSliderPow = 14

        let initalSliderValues = new Array(this.maxSliderPow - this.minSliderPow + 1);

        for (let i = 0; i < initalSliderValues.length; i++) {
            initalSliderValues[i] = 50;
        }

        this.state = {
            passType: "none",
            duration: 0,
            pitchShiftSemitones: 0,
            sliderValues: initalSliderValues,
            segmentIndex: -1,
            segments: [],
            bandPassLowThreshText: "",
            bandPassHighThreshText: "",
            highPassThreshText: "",
            lowPassThreshText: "",
            durationText: "",
            overdriveText: "",
            overdriveEnabled: false,
        }

    }

    secondsToMinutes(seconds) {

        let mins = Math.floor(seconds / 60);

        let secs = seconds % 60;

        secs = secs < 10 ? "0" + secs.toFixed(2) : secs.toFixed(2);

        return mins + ":" + secs;

    }

    getSegments() {

        let elements = [];

        let startTime = 0;

        for (let i = 0; i < this.state.segments.length; i++) {

            let segment = this.state.segments[i];

            let endTime = startTime + segment.duration;

            elements.push(<div
                style={{
                    border: `2px solid ${this.state.segmentIndex == i ? "blue" : "black"}`, padding: 10, marginTop: 5, cursor: "pointer"
                }}
                onClick={() => this.setState(prevState => {

                    let selectedSegment = prevState.segments[i];

                    return {
                        sliderValues: [...segment.sliderValues],
                        segmentIndex: i,
                        pitchShiftSemitones: selectedSegment.pitchShiftSemitones,
                        passType: selectedSegment.passType,
                        bandPassLowThreshText: selectedSegment.bandPassLowThresh == undefined ? "" : selectedSegment.bandPassLowThresh,
                        bandPassHighThreshText: selectedSegment.bandPassHighThresh == undefined ? "" : selectedSegment.bandPassHighThresh,
                        highPassThreshText: selectedSegment.highPassThresh == undefined ? "" : selectedSegment.highPassThresh,
                        lowPassThreshText: selectedSegment.lowPassThresh == undefined ? "" : selectedSegment.lowPassThresh,
                        durationText: selectedSegment.duration == undefined ? "" : selectedSegment.duration,
                        overdriveText: selectedSegment.overdriveThresh == undefined ? "" : selectedSegment.overdriveThresh,
                    }

                })}
            >
                <div><strong>{`Segment ${i}`}</strong></div>
                <div>{`${this.secondsToMinutes(startTime)} to ${this.secondsToMinutes(endTime)}`}</div>
            </div>);

            startTime += segment.duration;

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

            elements.push(<option value={i} selected={i == this.state.pitchShiftSemitones}>{i > 0 ? "+" + i : i}</option>)

        }

        return <select
            style={{ width: 50 }}
            onChange={e => this.setState({ pitchShiftSemitones: parseInt(e.target.value) })}
        >
            {elements}
        </select>;

    }

    getFilterInputs() {

        let inputs = null;

        switch (this.state.passType) {

            case "high": {
                inputs = <input type="text" value={this.state.highPassThreshText} onInput={e => this.setState({ highPassThreshText: e.target.value })} placeholder="threshold (Hz)"></input>
                break;
            }

            case "low": {
                inputs = <input type="text" value={this.state.lowPassThreshText} onInput={e => this.setState({ lowPassThreshText: e.target.value })} placeholder="threshold (Hz)"></input>
                break;
            }

            case "band": {
                inputs = <>
                    <input type="text" value={this.state.bandPassLowThreshText} onInput={e => this.setState({ bandPassLowThreshText: e.target.value })} placeholder="low threshold (Hz)"></input>
                    <input type="text" value={this.state.bandPassHighThreshText} onInput={e => this.setState({ bandPassHighThreshText: e.target.value })} placeholder="high threshold (Hz)"></input>
                </>
                break;
            }

            default : { break; }

        }

        return <>
            <select onChange={e => this.setState({ passType: e.target.value })}>
                <option value="none" selected={this.state.passType === "none"}>No Filter</option>
                <option value="high" selected={this.state.passType === "high"}>High Pass</option>
                <option value="low" selected={this.state.passType === "low"}>Low Pass</option>
                <option value="band" selected={this.state.passType === "band"}>Band Pass</option>
            </select>

            <div style={{ display: "inline-block" }}>
                {inputs}
            </div>

        </>

    }

    render() {

        return <div style={{ display: "flex", width: "100%", height: "100%", padding: 10 }}>

            <div style={{ flex: 1, height: "100%", padding: "0px 10px 10px 10px" }}>

                {this.state.segmentIndex >= 0 ? <div style={{ border: "2px solid black", width: 700, margin: "auto", padding: 10 }}>

                    <h2 style={{ display: "inline-block", margin: "auto" }}>{this.state.segmentIndex >= 0 ? `Segment ${this.state.segmentIndex} Parameters` : "No Segment Selected"}</h2>

                    <div style={{ margin: "10px auto 10px auto", width: "fit-content" }}>
                        {this.getSliders(this.minSliderPow, this.maxSliderPow)}
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Pitch Shift (Semitones)</label>
                        <br />
                        {this.getSemitoneSelect(-12, 12)}
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Filter</label>
                        <br />
                        {this.getFilterInputs()}
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Overdrive</label>
                        <br />
                        <input
                            type="checkbox"
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Tremolo</label>
                        <br />
                        <input
                            type="checkbox"
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Duration (Seconds)</label>
                        <br />
                        <input
                            type="text"
                            value={this.state.durationText}
                            onInput={e => this.setState({ durationText: e.target.value })}
                        />
                    </div>

                    {/*<div style={{ marginBottom: 10 }}>
                        <label>Overdrive</label>
                        <br />
                        <input
                            type="checkbox"
                            value={this.state.overdriveEnabled}
                            onChange={e => this.setState({ overdriveEnabled: e.target.value })}
                        />
                        {this.state.overdriveEnabled ? <input type="text" placeholder="magnitude (0 to 15)" /> : null}
                    </div>*/}

                    <button
                        style={{ marginRight: 10 }}
                        onClick={() => {

                            if (this.state.segmentIndex < 0) {
                                alert("Please select a segment to modify.");
                                return;
                            }

                            let duration = parseFloat(this.state.durationText);

                            if (isNaN(duration) || duration <= 0) {
                                alert("Please enter a valid segment duration.");
                                return;
                            }

                            let passParams = undefined;

                            switch (this.state.passType) {

                                case "high": {

                                    let highPassThresh = parseFloat(this.state.highPassThreshText);

                                    if (isNaN(highPassThresh)) {
                                        alert("Please enter a valid high pass filter threshold.");
                                        return;
                                    }

                                    passParams = { highPassThresh };

                                    break;
                                }

                                case "low": {

                                    let lowPassThresh = parseFloat(this.state.lowPassThreshText);

                                    if (isNaN(lowPassThresh)) {
                                        alert("Please enter a valid low pass filter threshold.");
                                        return;
                                    }

                                    passParams = { lowPassThresh };

                                    break;
                                }

                                case "band": {

                                    let bandPassLowThresh = parseFloat(this.state.bandPassLowThreshText);

                                    let bandPassHighThresh = parseFloat(this.state.bandPassHighThreshText);

                                    if (isNaN(bandPassLowThresh)) {
                                        alert("Please enter a valid band pass filter low threshold.");
                                        return;
                                    }

                                    if (isNaN(bandPassHighThresh)) {
                                        alert("Please enter a valid band pass filter high threshold.");
                                        return;
                                    }

                                    passParams = { bandPassHighThresh, bandPassLowThresh }

                                    break;
                                }

                                default : { break; }

                            }

                            this.setState(prevState => {

                                let segments = [...prevState.segments];

                                let segment = {
                                    sliderValues: [...this.state.sliderValues],
                                    pitchShiftSemitones: this.state.pitchShiftSemitones,
                                    passType: this.state.passType,
                                    duration,
                                    ...passParams
                                }

                                segments[prevState.segmentIndex] = segment;

                                return { segments };

                            });

                        }}
                    >Save Parameters</button>

                    <button
                        onClick={() => {

                            if (!window.confirm("Delete this segment?")) return;

                            this.setState(prevState => {

                                let segments = [...prevState.segments];

                                segments.splice(prevState.segmentIndex, 1);

                                return { segments, segmentIndex: prevState.segmentIndex - 1 }

                            });

                        }}
                    >Delete Segment</button>


                </div> :
                    <div>Please select a segment to get started.</div>
                }

            </div>

            <div style={{ width: 400, height: "100%", display: "flex", flexDirection: "column" }}>

                <div style={{ width: "100%", height: "fit-content" }}>

                    <button
                        style={{ marginBottom: 5, width: "100%" }}
                        onClick={() => this.setState(prevState => {

                            let segments = [...prevState.segments];

                            let newSegment = {
                                sliderValues: [...this.state.sliderValues],
                                pitchShiftSemitones: 0,
                                passType: "none",
                                duration: 10
                            }

                            segments.push(newSegment);

                            return { segments };

                        })}>Add Segment</button>

                    <button
                        style={{ width: "100%" }}
                        onClick={() => {

                            let instructions = [];

                            let framesPerSecond = 22;

                            let baseAddress = 0x40000000;

                            let currAddress = baseAddress;

                            for (let i = 0; i < this.state.segments.length; i++) {

                                let segment = this.state.segments[i];

                                let segmentDuration = segment.duration;

                                let segmentFrames = Math.round(framesPerSecond * segmentDuration);

                                //console.log("frames: " + segmentFrames);

                                for(let j = 0; j < segmentFrames; j++) {

                                    instructions.push(...this.setRegister(0, currAddress)); // start address

                                    instructions.push(...this.setRegister(1, 0)); // start index for load

                                    instructions.push(...this.setRegister(2, 64)); // compare reg

                                    instructions.push(`.load_${i}_${j}`);

                                    instructions.push(this.loadWaveElements(1, 0));

                                    instructions.push(this.incrementAndCompare(1, 2));

                                    instructions.push(this.branchPositive(`load_${i}_${j}`));

                                    instructions.push(...this.setRegister(3, 0)); // start index

                                    /*for(let bucket = 0; bucket < 1024; bucket++) {
                                        instructions.push(this.setFrequencyCoefficient(3, 1));
                                        instructions.push(this.incrementAndCompare(3, 3));
                                    }*/

                                    instructions.push("SYN");

                                    instructions.push(...this.setRegister(1, 0)); // start index for store

                                    instructions.push(`.store_${i}_${j}`);

                                    instructions.push(this.storeWaveElements(1, 0));

                                    instructions.push(this.incrementAndCompare(1, 2));

                                    instructions.push(this.branchPositive(`store_${i}_${j}`));

                                    currAddress += 4096; // each synth produces 2048 values - 4096 bytes

                                }

                            }

                            instructions.push("HALT");

                            console.log(instructions.join("\n"));


                        }}>Compile Segments</button>

                </div>

                <div style={{ width: "100%", flex: 1, overflow: "auto" }}>

                    {this.getSegments()}

                </div>

            </div>

        </div>
    }

    loadWaveElements(indexReg, addrReg) {
        return `LDE R${indexReg}, R${addrReg}`;
    }

    storeWaveElements(indexReg, addrReg) {
        return `STE R${indexReg}, R${addrReg}`;
    }

    setFrequencyCoefficient(indexReg, value) {
        return `SFC R${indexReg}, 0x${value.toString(16)}`;
    }

    incrementAndCompare(indexReg, compareReg) {
        return `INCC R${indexReg}, R${compareReg}`;
    }

    branchPositive(label) {
        return "BP ." + label;
    }

    setRegister(reg, value) {

        if (value < 0) {
            console.error("negative value for set register not implemented");
            return;
        }

        let buf = new Uint8Array(4);

        for (let i = 0; i < 4; i++) {
            buf[i] = (value & (0b11111111 << (8 * i))) >> (8 * i);
        }

        let instructions = [];

        //instructions.push(`// R${reg} = ${value}`)

        for (let i = 0; i < 4; i++) {
            instructions.push(`SR${i} R${reg}, 0x${buf[i].toString(16)}`);
        }

        return instructions;

    }


}



export default App;
