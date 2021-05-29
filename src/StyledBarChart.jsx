// import * as React from 'react';
import React, {useState} from 'react';


  import styled from 'styled-components'
  import {
    BarChart,
    BarGroup,
    Bar,
    HintPoint,
    TooltipWrapper,
    TooltipLabel,
    TooltipValue,
    TooltipXAxisValue,
  } from 'styled-chart'

  
  
  // That's how you style the bars e.g. Dogs, Cats
  const StyledBar = styled(Bar)`
    && {
      ${({ backgroundColor }) => `
        background-color: ${backgroundColor};
      `}
    }
  `
  // That's how you style the "parent" bar Pets
  const StyledBarGroup = styled(BarGroup)`
    && {
      margin: 0 4px;
    }
  `
  // That's how you can style the Tooltip
  const StyledTooltip = styled(TooltipWrapper)`
    && {
      ${({ backgroundColor, textColor }) => `
        ${backgroundColor ? `background: ${backgroundColor}` : ``};
        ${textColor ? `color: ${textColor}` : `white`};
      `}
      ${TooltipLabel} {
        font-style: normal;
      }
      ${TooltipValue} {
        font-style: italic;
      }
      ${TooltipXAxisValue} {
        opacity: 0.8;
      }
    }
  `
  // That's how you style the 'colored hint dots' in the tooltip
  const StyledHint = styled(HintPoint)`
    && {
      ${({ backgroundColor }) => `
        background-color: ${backgroundColor};
      `}
    }
  `
  const CHART_HEIGHT = 300
  
    // xAxis uses the 'weekday' as a key to prolongate the chart horizontally
    // you can change it to anything you specify in the data items
    // e.g. 'date'
    const X_AXIS = {
      key: 'weekday',
    }
  
    const Y_AXIS = {
    }
  
    const CONFIG = {
      'dogs': {
        label: 'Dogs',
        isParent: false,
        component: (
          <StyledBar 
            backgroundColor="#3ab997"
          />
        ),
      },
      'cats': {
        label: 'Cats',
        isParent: false,
        component: (
          <StyledBar 
            backgroundColor="#3a54b9"
          />
        ),
      },
      'mice': {
        label: 'Mice',
        isParent: false,
        component: (
          <StyledBar 
            backgroundColor="pink"
          />
        ),
      },
      'pets': {
        label: 'Pets',
        isParent: true,
        component: <StyledBarGroup />,
      },
      
    }
  
    const TOOLTIP = {
      isVisible: true,
      component: (
        <StyledTooltip />
      ),
      hints: {
        'dogs': <StyledHint backgroundColor='#3ab997' />,
        'cats': <StyledHint backgroundColor='#3a54b9' />,
        'mice': <StyledHint backgroundColor='pink' />,
        'pets': <StyledHint backgroundColor='#c8cc48' />,
        
      },
    }
  
  
  const StyledBarChart = (props) => {

    
      

      const { testData, setTestData } = props;
  
    return (
      <BarChart
        height={CHART_HEIGHT}
        tooltip={TOOLTIP}
        yAxis={Y_AXIS}
        xAxis={X_AXIS}
        config={CONFIG}
        data={testData}
      />
    )
  }
    
  export default StyledBarChart