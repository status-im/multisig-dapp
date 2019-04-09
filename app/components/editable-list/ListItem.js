/** Source based on https://github.com/cesarParra/react-editable-list/tree/12f095fb0f0efac15c17f8dfe52a4496725b8336 */
import React from 'react';
import Blockies from 'react-blockies';
import { Button } from 'react-bootstrap';
import './ListItem.css';

class ListItem extends React.Component {
    constructor() {
        super();

        // Creates a reference that is then defined in the parent div for this component.
        this.ref = React.createRef();
    }

    componentDidMount() {
        // The 'current' property of the ref gives us the DOM element tied to the reference, which
        // we then use to focus the element as soon as it is created.
        //this.ref.current.focus();

        this.ref.current.textContent = this.props.item.itemContent;
    }

    render() {
        var address = this.props.item? this.props.item.itemContent : this.ref.current.textContent;
        address = address ? address.toLowerCase() : "";
        return (
            <div className="list-item-container">
                <div className="blocky">
                    <Blockies seed={address} size={8} scale={3}/>
                </div>
                <div className="list-item" onKeyPress={(event) => this.onKeyPress(event)} onKeyUp={(event) => this.onKeyUp(event)} 
                    ref={this.ref} contentEditable placeholder={this.props.placeholder} onPaste={(event) => this.handlePaste(event)}>
                </div>
                <div className="del-button">
                    {this.renderRemoveButton()}
                </div>
            </div>
        );
    }

    renderRemoveButton() {
        if (!this.props.item.extraContent) {
            return (
                <Button size="sm" variant="danger" onClick={(event) => this.handleRemove(event)} className="remove-button" >[x]</Button>
            );
        }
    }

    handleRemove(event) {
        event.preventDefault();
        this.props.onRemove(this.props.item.id);
    }

    onKeyPress(event) {
        if (event.charCode === 13) {
            event.preventDefault();
        }
    }

    onKeyUp(event) {
        let text = this.ref.current.textContent;
        this.props.onKeyUp(event, this.props.item.id, text);
    }

    handlePaste(event) {
        var clipboardData, pastedData;

        // Stop data actually being pasted into div
        event.stopPropagation();
        event.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = event.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');

        let linesAdded = pastedData.split('\n');
        // We only want to paste the first line and then let the List component handle the rest of them
        if (linesAdded.length === 0) {
            return;
        }

        let currentText = this.ref.current.textContent;
        currentText = currentText + linesAdded[0];
        this.ref.current.textContent = currentText;

        linesAdded.splice(0, 1);
        this.props.onPaste(this.props.item.id, linesAdded);
    }

    focus() {
        this.ref.current.focus();
    }
}

export default ListItem;
