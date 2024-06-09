import * as React from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { fabric } from "fabric";

type props = {
    width: number;
    height: number;
    month: number;
    year: number;
}

const Calendar: React.FC<props> = (props) => {
    const canvasRef = React.useRef<fabric.Canvas | null>(null);

    React.useEffect(() => {
        const canvas = new fabric.Canvas('canvas');
        canvasRef.current = canvas;
        drawCalendar(canvas, props.width, props.height, props.month, props.year);

        // Render the canvas as SVG inside the div with id="svgimg"
        if(canvasRef.current) {
            const svg = canvasRef.current.toSVG();
            const svgImgDiv = document.getElementById('svgimg');
            if(svgImgDiv) {
                svgImgDiv.innerHTML = svg;
            }
        }
    }, [props.width, props.height, props.month, props.year]);

    const drawCalendar = (
        canvas: fabric.Canvas,
        width: number,
        height: number,
        month: number,
        year: number,
    ) => {
        // Calculate cell width
        const cellWidth = width / 7;
        const cellHeight = height / 6;

        // Draw days
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        let day = 1;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                const isWeekend = j === 0 || j === 6;
                const isBlank = (i === 0 && j < firstDay) || day > lastDay;
                const rect = new fabric.Rect({
                    left: j* cellWidth,
                    top: i * cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                    fill: isBlank ? '#D3D3D3' : isWeekend ? '#E6E6E6' : '#FFFFFF',
                    stroke: '#FFFFFF',
                    strokeWidth: 1,
                });
                canvas.add(rect);
            }
        }
    }

    return (
        <Text>
            Yay! The month is {props.month} and year is {props.year}. Remember, 0 = January so 8 = September.
        </Text>
    );
};

export default Calendar;