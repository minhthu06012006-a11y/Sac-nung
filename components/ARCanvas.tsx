'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

interface ARCanvasProps {
  onCapture: (imgData: string) => void;
  isPaused: boolean;
}

export default function ARCanvas({ onCapture, isPaused }: ARCanvasProps) {
  // GÓI TOÀN BỘ BIẾN VÀO "KÉT SẮT" ĐỂ KHÔNG BỊ MẤT DỮ LIỆU KHI REACT TẢI LẠI TRANG
  const state = useRef({
    capture: null as any,
    poses: [] as any[],
    poseNet: null as any,
    modelLoaded: false,
    outfits: [] as any[],
    initAI: null as any,
    currentOutfitIndex: 0,
    isCounting: false,
    countdownStart: 0,
    smoothedW: 0,
    smoothedH: 0,
    smoothedX: 0,
    smoothedY: 0
  }).current;

  const onCaptureRef = useRef(onCapture);
  const isPausedRef = useRef(isPaused);
  useEffect(() => { onCaptureRef.current = onCapture; }, [onCapture]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Xóa camera khi người dùng rời khỏi trang
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

  const setup = useCallback((p5: any, canvasParentRef: Element) => {
    const container = canvasParentRef.parentElement;
    const w = container ? container.clientWidth : p5.windowWidth;
    const h = container ? container.clientHeight : p5.windowHeight;
    
    p5.createCanvas(w, h).parent(canvasParentRef);
    
    state.capture = p5.createCapture(p5.VIDEO);
    state.capture.size(640, 480);
    state.capture.hide(); 

    for (let i = 1; i <= 10; i++) {
      state.outfits.push(p5.loadImage(`/assets/outfit${i}.png`));
    }

    state.initAI = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).ml5) {
        clearInterval(state.initAI);
        try {
          state.poseNet = (window as any).ml5.poseNet(state.capture, () => {
            console.log("✅ Mô hình PoseNet đã tải xong!");
            state.modelLoaded = true;
          });
          state.poseNet.on('pose', (results: any) => {
            state.poses = results;
          });
        } catch (err: any) {
          console.log("Lỗi AI:", err.message);
        }
      }
    }, 500);
  }, [state]);

  const draw = useCallback((p5: any) => {
    p5.background(0);
    
    if (state.capture && state.capture.width > 0) {
      const videoRatio = state.capture.width / state.capture.height;
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

      // VẼ CAMERA
      p5.push(); 
      p5.translate(p5.width / 2, p5.height / 2);
      p5.scale(-1, 1); 
      p5.imageMode(p5.CENTER);
      p5.image(state.capture, 0, 0, drawW, drawH);
      p5.pop(); 

      // Nếu đang chụp ảnh thì dừng tính toán AI (không vẽ đồ lên nữa)
      if (isPausedRef.current) return;

      const scaleX = drawW / state.capture.width;
      const scaleY = drawH / state.capture.height;
      
      const getScreenCoord = (kp: any) => {
        let px = (kp.position.x - state.capture.width / 2) * scaleX;
        let py = (kp.position.y - state.capture.height / 2) * scaleY;
        return { x: p5.width / 2 - px, y: p5.height / 2 + py };
      };

      if (state.modelLoaded && state.poses.length > 0) {
        let keypoints = state.poses[0].pose.keypoints;

        let leftShoulder = keypoints.find((k: any) => k.part === 'leftShoulder');
        let rightShoulder = keypoints.find((k: any) => k.part === 'rightShoulder');
        let leftHip = keypoints.find((k: any) => k.part === 'leftHip');
        let rightHip = keypoints.find((k: any) => k.part === 'rightHip');

        if (leftShoulder && rightShoulder && leftShoulder.score > 0.2 && rightShoulder.score > 0.2) {
          let lCoord = getScreenCoord(leftShoulder);
          let rCoord = getScreenCoord(rightShoulder);
          
          let centerX = (lCoord.x + rCoord.x) / 2;
          let centerY = (lCoord.y + rCoord.y) / 2;
          let shoulderWidth = p5.dist(lCoord.x, lCoord.y, rCoord.x, rCoord.y);

          let currentImg = state.outfits[state.currentOutfitIndex];
          if (currentImg) {
            let targetW, targetH, targetYOffset;
            let imgRatio = currentImg.height / currentImg.width;

            if (leftHip && rightHip && leftHip.score > 0.15 && rightHip.score > 0.15) {
                let lHipCoord = getScreenCoord(leftHip);
                let rHipCoord = getScreenCoord(rightHip);
                
                let midHipX = (lHipCoord.x + rHipCoord.x) / 2;
                let midHipY = (lHipCoord.y + rHipCoord.y) / 2;
                
                let hipWidth = p5.dist(lHipCoord.x, lHipCoord.y, rHipCoord.x, rHipCoord.y);
                let torsoHeight = p5.dist(centerX, centerY, midHipX, midHipY);

                targetW = Math.max(shoulderWidth * 3.5, hipWidth * 2.2); 
                targetH = torsoHeight * 3.8; 
                targetYOffset = targetH * 0.35; 
            } else {
                targetW = shoulderWidth * 3.8; 
                targetH = targetW * imgRatio * 0.65; 
                targetYOffset = targetH * 0.35; 
            }

            if (state.smoothedW === 0) {
                state.smoothedW = targetW;
                state.smoothedH = targetH;
                state.smoothedX = centerX;
                state.smoothedY = centerY + targetYOffset;
            } else {
                state.smoothedW = p5.lerp(state.smoothedW, targetW, 0.15);
                state.smoothedH = p5.lerp(state.smoothedH, targetH, 0.15);
                state.smoothedX = p5.lerp(state.smoothedX, centerX, 0.15);
                state.smoothedY = p5.lerp(state.smoothedY, centerY + targetYOffset, 0.15);
            }

            p5.push();
            p5.imageMode(p5.CENTER);
            p5.image(currentImg, state.smoothedX, state.smoothedY, state.smoothedW, state.smoothedH);
            p5.pop();
          }
        }

        // Tương tác tay
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

        let isHandRaisedHigh = false;
        if (nose && nose.score > 0.15) {
            let triggerY = nose.position.y;
            if (rightWrist && rightWrist.score > 0.1 && rightWrist.position.y < triggerY) {
                isHandRaisedHigh = true;
            } else if (leftWrist && leftWrist.score > 0.1 && leftWrist.position.y < triggerY) {
                isHandRaisedHigh = true;
            }
        }

        if (isHandRaisedHigh && !state.isCounting) {
            state.isCounting = true;
            state.countdownStart = p5.millis();
        }

        if (state.isCounting) {
            let elapsed = p5.millis() - state.countdownStart;
            let timeLeft = Math.ceil(3 - (elapsed / 1000));

            if (timeLeft > 0) {
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
                state.isCounting = false;
                let imgData = p5.canvas.toDataURL('image/jpeg', 1.0);
                onCaptureRef.current(imgData);
            }
        }

        // Vẽ 10 Nút bấm (2 cột x 5 hàng)
        let btnSize = 65; 
        let btnSpacingX = 80; 
        let btnSpacingY = 75; 
        let cols = 2;
        
        let startX = p5.width - 150; 
        let startY = p5.height / 2 - (btnSpacingY * 2); 

        for(let i = 0; i < 10; i++) {
          let col = i % cols; 
          let row = Math.floor(i / cols); 
          
          let btnX = startX + col * btnSpacingX;
          let btnY = startY + row * btnSpacingY;
          
          let d = p5.dist(cursorX, cursorY, btnX, btnY);
          let isHover = d < btnSize / 2;

          if (isHover) {
            state.currentOutfitIndex = i; 
            p5.fill(255, 255, 255, 255); 
            p5.stroke(0, 255, 0); 
            p5.strokeWeight(4);
          } else {
            p5.fill(255, 255, 255, 120); 
            p5.stroke(255);
            p5.strokeWeight(2);
          }

          if (state.currentOutfitIndex === i) {
             p5.stroke(255, 204, 0); 
             p5.strokeWeight(4);
          }
          
          p5.circle(btnX, btnY, btnSize);
          
          if (state.outfits[i]) {
            p5.imageMode(p5.CENTER);
            let thumbW = btnSize * 0.6;
            let thumbH = thumbW * (state.outfits[i].height / state.outfits[i].width);
            p5.image(state.outfits[i], btnX, btnY, thumbW, thumbH);
          }
        }
      }

      p5.push();
      p5.textAlign(p5.CENTER);
      p5.textStyle(p5.BOLD);
      p5.textFont('"Be Vietnam Pro", sans-serif'); 
      
      if (!state.modelLoaded) {
        p5.fill(255, 204, 0); 
        p5.textSize(24);
        p5.text("⏳ Đang khởi động AI...", p5.width / 2, 50);
      } else if (state.modelLoaded && state.poses.length === 0) {
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
  }, [state]);

  const windowResized = useCallback((p5: any) => {
    const container = p5.canvas.parentElement.parentElement;
    if (container) {
      p5.resizeCanvas(container.clientWidth, container.clientHeight);
    }
  }, []);

  const unmount = useCallback((p5: any) => {
    if (state.initAI) clearInterval(state.initAI);
    if (state.poseNet) {
        state.poseNet.removeAllListeners();
    }
    if (state.capture && state.capture.elt && state.capture.elt.srcObject) {
      state.capture.elt.srcObject.getTracks().forEach((track: any) => track.stop());
    }
    p5.remove();
  }, [state]);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black rounded-3xl">
      <Sketch setup={setup} draw={draw} windowResized={windowResized} unmount={unmount} />
    </div>
  );
}