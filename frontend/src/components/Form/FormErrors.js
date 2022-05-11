import React from 'react';

export const FormErrors = ({ formErrors }) =>
    <div className='formErrors'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                return (
                    <h5 style={{color: 'red'}} key={i}>{fieldName} {formErrors[fieldName]}</h5>
                )
            } else {
                return '';
            }
        })}
    </div>