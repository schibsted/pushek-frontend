import React, {FunctionComponent} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Device} from "../types/Device";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import {ListItemSecondaryAction, IconButton} from "@material-ui/core";

type DeviceListProps = {
    devices: Array<Device>
}

const DeviceList: FunctionComponent<DeviceListProps> = ({devices = []}) => {

    return (
        <List>
            {
                devices.map((device) => (
                    <ListItem button>
                        <ListItemIcon>
                            <Checkbox edge="start"/>
                        </ListItemIcon>
                        <ListItemText
                            primary={`${device.systemName} ${device.systemVersion} ${device.pusherType}`}>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="Comments">
                                {device.systemName.toLowerCase() === 'android' ?
                                    <Icon>android</Icon>
                                    :
                                    <Icon>phone_iphone</Icon>
                                }
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
        </List>
    );
};

export default DeviceList;
