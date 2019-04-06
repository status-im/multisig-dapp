/** Source based on https://github.com/cesarParra/react-editable-list/tree/12f095fb0f0efac15c17f8dfe52a4496725b8336 */
import React from 'react'
import uuidv4 from 'uuid/v4';
import ListItem from './ListItem';

class EditableList extends React.Component {
    constructor() {
        super();
        this.state = { listItems: [ { itemContent : null, extraContent: true, id : uuidv4()} ] };
    }

    componentDidMount() {
        let items = [];
        if (this.props.items) {
            items = this.props.items.map(function (currentItem) {
                return {
                    itemContent: currentItem,
                    extraContent: false,
                    id: uuidv4() 
                }
            });
        }

        items = [...items, ...this.state.listItems];

        this.setState({ listItems: items });
    }
    
    render() {
        return (
            <div>
                {this.renderListItems()}
            </div>
        );
    }

    renderListItems() {
        return this.state.listItems.map(
            (listItem) => {
                return(
                <ListItem key={listItem.id} item={listItem}
                    onKeyUp={this.onListItemKeyPress.bind(this)} 
                    onRemove={this.onRemove.bind(this)} onPaste={this.onPaste.bind(this)} 
                    placeholder={this.props.itemPlaceholder} ref={listItem.id} />);}
        );
    }

    onListItemKeyPress(event, listItemId, content) {
        let listItemsTemp = Array.from(this.state.listItems);
        let index = listItemsTemp.findIndex(item => item.id === listItemId);
        let currentItem = listItemsTemp[index];
        currentItem.itemContent = content;
        currentItem.extraContent = content ? false : currentItem.extraContent;
        this.setState({listItems: listItemsTemp}, () => {
            if (!content) {
                this.onChange();
            }
        });

        if (content) {
            this.ensureExtraContent();
        }
        
        if (event.keyCode === 13) {
            if (!content) {
                // If no content was added then we don't want to create a new list item
                return;
            }

            // Finding the next sibling by looking at the next list item in the list
            // and getting its Id.
            let nextId = listItemsTemp[index + 1].id;
            this.refs[nextId].focus();
        }
    }

    onRemove(listItemId) {
        let updatedItems = this.state.listItems.filter((item) => item.id !== listItemId);
        this.setState({ listItems: updatedItems }, () => {
            this.ensureExtraContent();
        });
    }

    onPaste(listItemId, linesAdded) {
        let listItemsTemp = Array.from(this.state.listItems);
        let index = listItemsTemp.findIndex(item => item.id === listItemId) + 1;
        for (var i = 0; i < linesAdded.length; i++) {
            listItemsTemp.splice(index + 1, 0, {itemContent: linesAdded[i], id: uuidv4()});
        }

        this.setState({ listItems: listItemsTemp }, () => {
            this.ensureExtraContent();
        });
    }

    ensureExtraContent(callback = this.onChange.bind(this)) {
        let hasExtraContent = false;
        this.state.listItems.forEach((currentItem) => {
            if (currentItem.extraContent) {
                hasExtraContent = true;
                callback();
                return;
            }
        });

        if (!hasExtraContent) {
            let listItemsTemp = Array.from(this.state.listItems);
            listItemsTemp.push({ itemContent: null, extraContent: true, id: uuidv4() });
            this.setState({ listItems : listItemsTemp}, callback);
        }
    }

    onChange() {
        if (!this.props.onChange) {
            return;
        }
        
        let editableListContents = {};
        editableListContents.title = this.state.title;
        editableListContents.listItems = this.state.listItems.map((listItem) => {
            return {
                id: listItem.id,
                text: listItem.itemContent
            };
        });

        this.props.onChange(editableListContents);
    }
}

export default EditableList;