// components/DonutChart.tsx
import React, { useEffect, useRef } from "react";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  thickness?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  textColor?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 200,
  thickness = 20,
  backgroundColor = "#e6e6e6",
  foregroundColor = "#4CAF50",
  textColor = "#333333",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = size;
    canvas.height = size;

    // 중심점 및 반지름 계산
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - thickness) / 2;

    // 배경 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // 퍼센트에 따른 호 그리기
    const startAngle = -Math.PI / 2; // 12시 방향에서 시작
    const endAngle = startAngle + (2 * Math.PI * percentage) / 100;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = foregroundColor;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // 텍스트 그리기
    ctx.font = `${size / 6}px Arial`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
  }, [
    percentage,
    size,
    thickness,
    backgroundColor,
    foregroundColor,
    textColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

export default ProgressCircle;
