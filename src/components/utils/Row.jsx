import React from 'react';
import { Input } from 'reactstrap';
import { Item, Label, Category } from '../Styles';

export const Row = ({ name, type, value, onChange, id, disabled, display }) => {
    return (
        <Item style={{display:display}}>
            <Label>{name}: </Label>
            <Category>
                <Input
                    type={type}
                    value={value}
                    onChange={onChange}
                    id={id}
                    disabled={disabled}
                >
                </Input>
            </Category>
        </Item>
    )
}
