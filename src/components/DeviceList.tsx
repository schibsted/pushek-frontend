import React, {FunctionComponent} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Device} from "../types/Device";

type DeviceListProps = {
    devices: Array<Device>
}

const DeviceList: FunctionComponent<DeviceListProps> = ({devices = []}) => {
    return (
        <List >
            {
                devices.map((device) => (
                    <ListItem button>
                        <ListItemText primary={device.name}> </ListItemText>
                    </ListItem>
                ))
            }
        </List>
    );
};

export default DeviceList;
