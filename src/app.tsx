import { Button, Rows, Box, FormField, NumberInput, Text, TextInput, Title, Select, Columns, Column } from "@canva/app-ui-kit";
import type { 
  AppElementRendererOutput, 
  NativeShapeElementWithBox,
  NativeTextElementWithBox,
} from "@canva/design";
import { initAppElement } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

type AppElementData = {
  rows: number;
  columns: number;
  width: number;
  height: number;
  spacing: number;
  month: number;
  year: number;
  shapeColor: string;
  weekendShapeColor: string;
  textColor: string;
  weekendTextColor: string;
  weekendDayLabelColor: string;
  decoration: "none" | "underline";
  fontStyle: "normal" | "italic";
  fontWeight: "normal" | "bold";
  fontSize: number;
  dayFontSize: number;
}

type UIState = AppElementData;

const initialState: UIState = {
  rows: 6,
  columns: 7,
  width: 30,
  height: 45,
  spacing: 0,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  shapeColor: "#E9E9E9",
  weekendShapeColor: "#f9cdcd",
  textColor: "#000000",
  weekendTextColor: "#FF0000",
  weekendDayLabelColor: "#FF0000",
  decoration: "none",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: 9,
  dayFontSize: 9,
}

const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    const elements: AppElementRendererOutput = [];
    const first_day = new Date(data.year, data.month).getDay();
    const number_of_days = new Date(data.year, data.month + 1, 0).getDate();

    let date = 1;
    
    // Add day labels to the elements
    for (let column = 0; column < data.columns; column++) {
      const { width, height, spacing, textColor, weekendTextColor, weekendDayLabelColor, decoration, fontStyle, fontWeight, dayFontSize } = data;
      const top = 0 - 15; // Day labels start at the very top
      const left = column * (width + spacing);
      const isWeekend = dayLabels[column] === 'Sun' || dayLabels[column] === 'Sat';
      const currentColor = isWeekend ? weekendDayLabelColor : textColor;

      const dayLabelElement = createTextElement({
        width: width - 3,
        height,
        top: top,
        left: left + 3 + spacing,
        text: dayLabels[column],
        color: currentColor,
        decoration,
        fontStyle,
        fontWeight,
        fontSize: dayFontSize,
      });
      elements.push(dayLabelElement);
    }

    for (let row=0; row < data.rows; row++) {
      for (let column=0; column<data.columns; column++) {
        const { width, height, spacing, month, year, shapeColor, weekendShapeColor, textColor, weekendTextColor, decoration, fontStyle, fontWeight, fontSize } = data;
        const top = row * (height + spacing);
        const left = column * (width + spacing);
        const currentDayOfWeek = (first_day + (date - 1)) % 7; // Calculate the day of the week (0 is Sunday, 6 is Saturday)
        const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
        const currentColor = isWeekend ? weekendTextColor : textColor;
        const currentShapeColor = isWeekend ? weekendShapeColor : shapeColor;


        if (row * data.columns + column >= first_day && date <= number_of_days ) {
        // Create shapes for calendar
        const element = createShapeElement({
          width,
          height,
          top,
          left,
          fill: currentShapeColor,
        });
        elements.push(element);

        // Start adding dates once the first_day is reached
          const textElement = createTextElement({
            width: width - 3,
            height,
            top: top + 2,
            left: left + 3,
            text: String(date),
            color: currentColor,
            decoration,
            fontStyle,
            fontWeight,
            fontSize,
          });
          elements.push(textElement);
          date++;
        }
      }
    }
    return elements;
  }
});

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);
  const { width, height, rows, columns, spacing, month, year, fontSize, dayFontSize, textColor, weekendTextColor, weekendDayLabelColor, shapeColor, weekendShapeColor } = state;
  const disabled = width < 1 || height < 1 || rows < 1 || columns < 1;
  
  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);
    

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="small">Calendar</Title>
        
            <FormField
              label="Month"
              control={(props) => (
                <Select
                  {...props} 
                  value={String(month)}
                  options={[
                    { value: "0", label: "January" },
                    { value: "1", label: "February" },
                    { value: "2", label: "March" },
                    { value: "3", label: "April" },
                    { value: "4", label: "May" },
                    { value: "5", label: "June" },
                    { value: "6", label: "July" },
                    { value: "7", label: "August" },
                    { value: "8", label: "September" },
                    { value: "9", label: "October" },
                    { value: "10", label: "November" },
                    { value: "11", label: "December" },
                  ]}             
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        month: Number(value || 0)
                      };
                    });
                  }}
                  stretch
                />
              )}
            />
            <FormField
              label="Year"
              value={year}
              control={(props) => (
                <NumberInput
                  {...props}
                  incrementAriaLabel="Increase Year"
                  hasSpinButtons
                  decrementAriaLabel="Decrease Year"
                  defaultValue={year}
                  step={1}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        year: Number(value || 0),
                      };
                    });
                  }}
                />
              )}
            />

        <Title size="small">Appearance</Title>
        <Columns spacing="1u">
          <Column width="1/3">
            <FormField
              label="Spacing"
              value={spacing}
              control={(props) => (
                <NumberInput
                  {...props}
                  min={0}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        spacing: Number(value || 0),
                      };
                    });
                  }}
                />
              )}
            />
          </Column>
          <Column width="1/3">
          <FormField
            label="Width"
            value={width}
            control={(props) => (
              <NumberInput
                {...props}
                min={1}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      width: Number(value || 0),
                    };
                  });
                }}
              />
            )}
          />
          </Column>
          <Column width="1/3">
          <FormField
            label="Height"
            value={height}
            control={(props) => (
              <NumberInput
                {...props}
                min={1}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      height: Number(value || 0),
                    };
                  });
                }}
              />
            )}
          />
          </Column>
        </Columns>       
        
        <Title size="small">Text Options</Title>
          <FormField
            label="Date Size"
            value={fontSize}
            control={(props) => (
              <NumberInput
                {...props}
                incrementAriaLabel="Increase Text Size"
                hasSpinButtons
                decrementAriaLabel="Decrease Text Size"
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      fontSize: Number(value || 0),
                    };
                  });
                }}
                step={1}
              />
            )}
          />
          <FormField
            label="Day Label Size"
            value={dayFontSize}
            control={(props) => (
              <NumberInput
                {...props}
                incrementAriaLabel="Increase Text Size"
                hasSpinButtons
                decrementAriaLabel="Decrease Text Size"
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      dayFontSize: Number(value || 0),
                    };
                  });
                }}
                step={1}
              />
            )}
          />
          <FormField
            label="Weekday Color"
            value={textColor}
            control={(props) => (
              <TextInput
                {...props}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      textColor: value,
                    };
                  });
                }}
              />
            )}
          />
          <FormField
            label="Weekend Color"
            value={weekendTextColor}
            control={(props) => (
              <TextInput
                {...props}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      weekendTextColor: value,
                    };
                  });
                }}
              />
            )}
          />
          <FormField
            label="Weekend Day Label Color"
            value={weekendDayLabelColor}
            control={(props) => (
              <TextInput
                {...props}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      weekendDayLabelColor: value,
                    };
                  });
                }}
              />
            )}
          />

        <Title size="small">Cell Options</Title>
            <FormField
              label="Weekday Color"
              value={shapeColor}
              control={(props) => (
                <TextInput
                  {...props}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        shapeColor: value,
                      };
                    });
                  }}
                />
              )}
            />
            <FormField
              label="Weekend Color"
              value={weekendShapeColor}
              control={(props) => (
                <TextInput
                  {...props}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        weekendShapeColor: value,
                      };
                    });
                  }}
                />
              )}
            />

        <Button
          variant="primary"
          onClick={() => {
            appElementClient.addOrUpdateElement(state);
          }}
          disabled={disabled}
        >
          Add to design
        </Button>
      </Rows>
    </div>
  )
};

const createShapeElement = ({
  width,
  height,
  top,
  left,
  fill,
}: {
  width: number;
  height: number;
  top: number;
  left: number;
  fill: string;
}): NativeShapeElementWithBox => {
  return {
    type: "SHAPE",
    paths: [
      {
        d: `M 0 0 h ${width} V ${height} H 0 L 0 0`,
        fill: {
          dropTarget: false,
          color: fill,
        },
      },
    ],
    viewBox: {
      width,
      height,
      top: 0,
      left: 0,
    },
    width,
    height,
    top,
    left,
  };
};

const createTextElement = ({
  width,
  top,
  left,
  text,
  color,
  decoration,
  fontStyle,
  fontWeight,
  fontSize,
}: {
  width: number;
  height: number;
  top: number;
  left: number;
  text: string;
  color: string
  decoration: "none" | "underline";
  fontStyle: "normal" | "italic";
  fontWeight: "normal" | "bold";
  fontSize: number;
}): NativeTextElementWithBox => {
  return {
    type: "TEXT",
    children: [text],
    width,
    top,
    left,
    color,
    decoration,
    fontStyle,
    fontWeight,
    fontSize,
  };
};