import ItemCard from '../ItemCard/Itemcard';
import React from "react";
import {connect} from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";



const ShareItemPreview = ({shareItemPreview, classes}) => {
    return (
        <div className = {classes.container}>
            <ItemCard item = {shareItemPreview}/>
        </div>
    )
}

const mapStateToProps = ({shareItemPreview}) => {
    return {shareItemPreview}
}

export default connect(mapStateToProps)(withStyles(styles)(ShareItemPreview));