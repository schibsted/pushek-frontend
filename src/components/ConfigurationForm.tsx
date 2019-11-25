import React, {FunctionComponent} from 'react';
import TextField from "@material-ui/core/TextField";
import {Grid} from "@material-ui/core";
import {ConfigurationField} from "../types/ConfigurationField";
import Typography from "@material-ui/core/Typography";

type ConfigurationFormProps = {
    fields: Array<ConfigurationField>
    onInputChange: Function,
    onInputBlur: Function,
}

const ConfigurationForm: FunctionComponent<ConfigurationFormProps> = ({fields = [], onInputChange, onInputBlur}) => {

    return (
        <form noValidate autoComplete="off">
            <Typography
                component="p"
                variant="inherit"
                color="inherit"
                noWrap
                style={{flex: 1, margin: 20}}
            >
                Configuration
            </Typography>
            <Grid container xs={12}>
                {fields.map((field) => (
                    <Grid item xs={12}>
                        <TextField
                            key={field.name}
                            error={field.error}
                            label={field.name}
                            name={field.name}
                            value={field.value}
                            required={field.required}
                            onBlur={() => onInputBlur()}
                            onChange={event => onInputChange(event, field.name)}
                            margin="normal"
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>
        </form>
    )
        ;
};

export default ConfigurationForm;
