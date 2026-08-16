'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

interface ARCanvasProps {
  onCapture: (imgData: string) => void;
  isPaused: boolean;
}

export default function ARCanvas({ onCapture, isPaused }: ARCanvasProps) {
  let capture: any;
  let poses: any[] = [];
  let poseNet: any;
  let modelLoaded = false;
  let outfits: any[] = [];
  let initAI: any; 
  
  let currentOutfitIndex = 0;
  
  let isCounting = false;
  let countdownStart = 0;

  const onCaptureRef = useRef(onCapture);
  const isPausedRef = useRef(isPaused);
  useEffect(() => { onCaptureRef.current = onCapture; }, [onCapture]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    return () => {
      document.querySelectorAll('video').forEach((vid) => {
        if (vid.srcObject) {
          const stream = vid.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          vid.srcObject = null;
        }
      });
    };
  }, []);

  const setup = (p5: any, canvasParentRef: Element) => {
    const container = canvasParentRef.parentElement;
    const w = container ? container.clientWidth : p5.windowWidth;
    const h = container ? container.clientHeight : p5.windowHeight;
    
    p5.createCanvas(w, h).parent(canvasParentRef);
    
    capture = p5.createCapture(p5.VIDEO);
    capture.size(640, 480);
    capture.hide(); 

    for (let i = 1; i <= 4; i++) {
      outfits.push(p5.loadImage(`/assets/outfit${i}.png`));
    }

    initAI = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).ml5) {
        clearInterval(initAI);
        try {
          poseNet = (window as any).ml5.poseNet(capture, () => {
            console.log("✅ Mô hình PoseNet đã tải xong!");
            modelLoaded = true;
          });
          poseNet.on('pose', (results: any) => {
            poses = results;
          });
        } catch (err: any) {
          console.log("Lỗi AI:", err.message);
        }
      }
    }, 500);
  };

  const draw = (p5: any) => {
    if (isPausedRef.current) return;

    p5.background(0);
    
    if (capture && capture.width > 0) {
      const videoRatio = capture.width / capture.height;
      const canvasRatio = p5.width / p5.height;
      
      let drawW = p5.width;
      let drawH = p5.height;

      if (canvasRatio > videoRatio) {
        drawW = p5.width;
        drawH = p5.width / videoRatio;
      } else {
        drawW = p5.height * videoRatio;
        drawH = p5.height;
      }

      p5.push(); 
      p5.translate(p5.width / 2, p5.height / 2);
      p5.scale(-1, 1); 
      p5.imageMode(p5.CENTER);
      p5.image(capture, 0, 0, drawW, drawH);
      p5.pop(); 

      const scaleX = drawW / capture.width;
      const scaleY = drawH / capture.height;
      
      const getScreenCoord = (kp: any) => {
        let px = (kp.position.x - capture.width / 2) * scaleX;
        let py = (kp.position.y - capture.height / 2) * scaleY;
        return { x: p5.width / 2 - px, y: p5.height / 2 + py };
      };

      if (modelLoaded && poses.length > 0) {
        let keypoints = poses[0].pose.keypoints;

        let leftShoulder = keypoints.find((k: any) => k.part === 'leftShoulder');
        let rightShoulder = keypoints.find((k: any) => k.part === 'rightShoulder');

        if (leftShoulder && rightShoulder && leftShoulder.score > 0.2 && rightShoulder.score > 0.2) {
          let lCoord = getScreenCoord(leftShoulder);
          let rCoord = getScreenCoord(rightShoulder);
          
          let centerX = (lCoord.x + rCoord.x) / 2;
          let centerY = (lCoord.y + rCoord.y) / 2;
          let shoulderWidth = p5.dist(lCoord.x, lCoord.y, rCoord.x, rCoord.y);

          let currentImg = outfits[currentOutfitIndex];
          if (currentImg) {
            let scaleFactor = 3.5;
            let dressW = shoulderWidth * scaleFactor;
            let dressH = dressW * (currentImg.height / currentImg.width);
            let yOffset = dressH * 0.3; 
            
            p5.push();
            p5.imageMode(p5.CENTER);
            p5.image(currentImg, centerX, centerY + yOffset, dressW, dressH);
            p5.pop();
          }
        }

        let leftWrist = keypoints.find((k: any) => k.part === 'leftWrist');
        let rightWrist = keypoints.find((k: any) => k.part === 'rightWrist');
        let leftElbow = keypoints.find((k: any) => k.part === 'leftElbow');
        let rightElbow = keypoints.find((k: any) => k.part === 'rightElbow');
        
        let nose = keypoints.find((k: any) => k.part === 'nose');

        let cursorX = -100, cursorY = -100;

        if (rightWrist && rightElbow && rightWrist.score > 0.2 && rightWrist.position.y < rightElbow.position.y) {
          let coord = getScreenCoord(rightWrist);
          cursorX = coord.x; 
          cursorY = coord.y - 80; 
        } else if (leftWrist && leftElbow && leftWrist.score > 0.2 && leftWrist.position.y < leftElbow.position.y) {
          let coord = getScreenCoord(leftWrist);
          cursorX = coord.x; 
          cursorY = coord.y - 80; 
        }

        if (cursorX !== -100) {
          p5.fill(255, 50, 50, 150);
          p5.noStroke();
          p5.circle(cursorX, cursorY, 40); 
          p5.fill(255);
          p5.circle(cursorX, cursorY, 15); 
        }

        // ==========================================
        // LỚP MỚI: NHẬN DIỆN CỬ CHỈ GIƠ TAY QUA ĐẦU ĐỂ CHỤP
        // ==========================================
        let isHandRaisedHigh = false;
        
        if (nose && nose.score > 0.2) {
            // Lấy tọa độ Y của mũi trừ đi một khoảng (để lấy vị trí ước lượng của đỉnh đầu)
            // Trong Canvas, Y càng nhỏ thì vị trí càng cao
            let headTopY = nose.position.y - 80;

            // Kiểm tra xem có cổ tay nào giơ cao vượt qua đỉnh đầu không
            if (rightWrist && rightWrist.score > 0.2 && rightWrist.position.y < headTopY) {
                isHandRaisedHigh = true;
            } else if (leftWrist && leftWrist.score > 0.2 && leftWrist.position.y < headTopY) {
                isHandRaisedHigh = true;
            }
        }

        if (isHandRaisedHigh && !isCounting) {
            isCounting = true;
            countdownStart = p5.millis();
        }

        if (isCounting) {
            let elapsed = p5.millis() - countdownStart;
            let timeLeft = Math.ceil(3 - (elapsed / 1000));

            // Nếu người dùng bỏ tay xuống ngang chừng -> Hủy đếm ngược
            if (!isHandRaisedHigh) {
                isCounting = false;
            } else if (timeLeft > 0) {
                p5.push();
                p5.fill(255, 204, 0, 180);
                p5.noStroke();
                p5.circle(p5.width / 2, p5.height / 2, 200);
                p5.fill(0);
                p5.textSize(100);
                p5.textAlign(p5.CENTER, p5.CENTER);
                p5.text(timeLeft, p5.width / 2, p5.height / 2);
                p5.pop();
            } else {
                isCounting = false;
                let imgData = p5.canvas.toDataURL('image/jpeg', 1.0);
                onCaptureRef.current(imgData);
            }
        }

        let btnSize = 80;
        let btnSpacing = 100;
        let startY = p5.height / 2 - (btnSpacing * 1.5);
        let btnX = p5.width - 100; 

        for(let i = 0; i < 4; i++) {
          let btnY = startY + i * btnSpacing;
          let d = p5.dist(cursorX, cursorY, btnX, btnY);
          let isHover = d < btnSize / 2;

          if (isHover) {
            currentOutfitIndex = i; 
            p5.fill(255, 255, 255, 255); 
            p5.stroke(0, 255, 0); 
            p5.strokeWeight(4);
          } else {
            p5.fill(255, 255, 255, 120); 
            p5.stroke(255);
            p5.strokeWeight(2);
          }

          if (currentOutfitIndex === i) {
             p5.stroke(255, 204, 0); 
             p5.strokeWeight(5);
          }
          p5.circle(btnX, btnY, btnSize);
          if (outfits[i]) {
            p5.imageMode(p5.CENTER);
            let thumbW = btnSize * 0.6;
            let thumbH = thumbW * (outfits[i].height / outfits[i].width);
            p5.image(outfits[i], btnX, btnY, thumbW, thumbH);
          }
        }
      }

      p5.push();
      p5.textAlign(p5.CENTER);
      p5.textStyle(p5.BOLD);
      p5.textFont('"Be Vietnam Pro", sans-serif'); 
      
      if (!modelLoaded) {
        p5.fill(255, 204, 0); 
        p5.textSize(24);
        p5.text("⏳ Đang khởi động AI...", p5.width / 2, 50);
      } else if (modelLoaded && poses.length === 0) {
        p5.noFill();
        p5.stroke(255, 255, 255, 150);
        p5.strokeWeight(2);
        p5.drawingContext.setLineDash([10, 10]);
        let boxW = 400;
        let boxH = 500;
        p5.rect(p5.width / 2 - boxW / 2, p5.height / 2 - boxH / 2 + 50, boxW, boxH, 20);

        p5.drawingContext.setLineDash([]);
        p5.fill(255, 100, 100); 
        p5.noStroke();
        p5.textSize(20);
        p5.text("Lùi lại và đứng vào trong khung đứt nét", p5.width / 2, p5.height - 50);
        p5.text("Vùng nhận diện cơ thể", p5.width / 2, p5.height / 2 + 150);
      }
      p5.pop();
    }
  };

  const windowResized = (p5: any) => {
    const container = p5.canvas.parentElement.parentElement;
    if (container) {
      p5.resizeCanvas(container.clientWidth, container.clientHeight);
    }
  };

  const unmount = (p5: any) => {
    if (initAI) clearInterval(initAI);
    if (poseNet) poseNet.removeAllListeners();
    if (capture && capture.elt && capture.elt.srcObject) {
      capture.elt.srcObject.getTracks().forEach((track: any) => track.stop());
    }
    p5.remove();
  };

  const sketchProps: any = {
    setup,
    draw,
    windowResized,
    unmount
  };

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black rounded-3xl">
      <Sketch {...sketchProps} />
    </div>
  );
}