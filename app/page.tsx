"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
}

interface ShapeConfig {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
  isCircle: boolean;
  blurClass: string;
  clipPath?: string;
}

export default function App() {
  const loiChucRef = useRef<HTMLDivElement>(null);

  // States for comment form
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      name: "Nhóm chúng em gồm: Na, Viên, Diễm, Hằng",
      date: "20/11/2026",
      text: "Là leader của nhóm - Luyn Na, em xin đại diện nhóm kính chúc thầy cô luôn dồi dào sức khoẻ, nụ cười luôn nở trên môi. Cảm ơn thầy cô vì tất cả!"
    }
  ]);

  const shapes = React.useMemo(() => {
    const colors = ['#2af598', '#009efd', '#ffffff', '#11998e', '#0cebeb', '#38ef7d'];
    return Array.from({ length: 20 }).map((_, i) => {
      // Deterministic pseudorandom generation using Math.sin inside useMemo
      // ensures purity during React renders and prevents Hydration Mismatch issues.
      const val1 = Math.abs(Math.sin(i * 12.345));
      const val2 = Math.abs(Math.cos(i * 54.321));
      const val3 = Math.abs(Math.sin(i * 87.654));
      const val4 = Math.abs(Math.cos(i * 45.678));
      const val5 = Math.abs(Math.sin(i * 98.765));

      const isCircle = val1 > 0.5;
      return {
        id: i,
        size: Math.floor(val2 * 50 + 15),
        left: Math.floor(val3 * 100),
        duration: Math.floor(val4 * 20 + 10),
        delay: Math.floor(val5 * 15),
        color: colors[Math.floor(Math.abs(Math.sin(i * 11.111)) * colors.length)],
        isCircle,
        blurClass: isCircle && val1 > 0.7 ? 'blur-[8px]' : !isCircle ? 'blur-[4px]' : '',
        clipPath: !isCircle ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined
      };
    });
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        const mappedComments = data.map((c: { id: string | number, name: string, created_at: string, text: string }) => ({
          id: c.id?.toString() || Date.now().toString() + Math.random(),
          name: c.name,
          date: new Date(c.created_at).toLocaleDateString('vi-VN'),
          text: c.text
        }));
        
        // Merge the loaded database comments while keeping the default message at the bottom
        setComments((prev) => [...mappedComments, prev[prev.length - 1]]);
      }
    };
    fetchComments();

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.hidden-element');
    elements.forEach((el, index) => {
        (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleShowMessage = () => {
    alert("Chúc Thầy Cô có một ngày 20/11 thật ý nghĩa, ngập tràn niềm vui và những lẵng hoa tươi thắm nhất! 🎉");
    loiChucRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && commentText.trim()) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('vi-VN');
      
      const newComment: Comment = {
        id: Date.now().toString(),
        name: name.trim(),
        date: dateStr,
        text: commentText.trim()
      };
      
      // Update ui instantly
      setComments([newComment, ...comments]);
      
      const safeName = name.trim();
      const safeText = commentText.trim();
      setName("");
      setCommentText("");
      
      if (supabase) {
        // Optimistic push to DB without awaiting UI blockage
        supabase.from('comments').insert([
          { name: safeName, text: safeText }
        ]).then(({ error }) => {
            if (error) console.error("Lỗi khi đăng bình luận Supabase:", error);
        });
      }
    }
  };

  return (
    <>
      <div className="floating-shapes">
        {shapes.map(shape => (
          <div
            key={shape.id}
            className={`shape ${shape.blurClass}`}
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.left}%`,
              background: shape.color,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.delay}s`,
              borderRadius: shape.isCircle ? '50%' : '0',
              clipPath: shape.clipPath
            }}
          />
        ))}
      </div>

      <div className="container-custom">
          <div className="card hidden-element scale-up">
              <h1 className="title-h1">Chuyến Đò Tri Thức 20/11</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full z-10 relative">
                  {/* Ảnh chính lớn (cover) */}
                  <div className="md:col-span-2 overflow-hidden rounded-2xl shadow-md border-4 border-white/80 relative group h-[250px] md:h-[350px]">
                      <Image 
                        src="/641212384_899257676230160_5345605700520802988_n.jpg"
                        alt="Kỷ niệm 20/11 đầy ý nghĩa - Hình 1" 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      />
                  </div>
                  {/* 2 Ảnh phụ nhỏ bên dưới */}
                  <div className="overflow-hidden rounded-2xl shadow-md border-4 border-white/80 relative group h-[200px]">
                      <Image 
                        src="/641745568_865354476536745_5846384155635316375_n.jpg" 
                        alt="Kỷ niệm 20/11 dạt dào cảm xúc - Hình 2" 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-md border-4 border-white/80 relative group h-[200px]">
                      <Image 
                        src="/643814062_26080598481599872_6367261964687274644_n.jpg" 
                        alt="Kỷ niệm 20/11 vui vẻ - Hình 3" 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      />
                  </div>
              </div>
              
              <p className="text-p hidden-element slide-left">
                Nhân ngày Nhà giáo Việt Nam, kính chúc <span className="highlight">Quý Thầy Cô</span> luôn mạnh khỏe, hạnh phúc và tràn đầy nhiệt huyết trên con đường sự nghiệp trồng người.
              </p>
              <p className="text-p hidden-element slide-right">
                Cảm ơn Thầy Cô đã luôn tận tâm dìu dắt, truyền đạt kiến thức và là nguồn cảm hứng vô tận cho chúng em bước vào đời.
              </p>
              <p className="text-p hidden-element slide-left">
                Chúng em mãi biết ơn và trân trọng những công lao to lớn ấy. 💖
              </p>
              
              <button className="btn-primary hidden-element" onClick={handleShowMessage}>
                🌿 Gửi Tấm Lòng Trân Quý 🌿
              </button>
          </div>

          <div className="comment-section hidden-element slide-right" id="loi-chuc" ref={loiChucRef}>
              <h2>Gửi lời chúc đến thầy cô</h2>
              <form id="comment-form" onSubmit={handleCommentSubmit}>
                  <div className="form-group">
                      <label htmlFor="userName">Tên của bạn:</label>
                      <input 
                        type="text" 
                        id="userName" 
                        placeholder="Nhập tên của bạn..." 
                        required 
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                  <div className="form-group">
                      <label htmlFor="userComment">Lời chúc/Bình luận:</label>
                      <textarea 
                        id="userComment" 
                        placeholder="Hãy viết những lời chúc chân thành, tốt lành nhất gửi tới các thầy cô giáo của mình..." 
                        required
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '12px', marginTop: '10px' }}>
                    Gửi Lời Chúc 💌
                  </button>
              </form>

              <div className="comments-list">
                  {comments.map((comment) => (
                    <div className="comment-item" key={comment.id}>
                        <h4>{comment.name}</h4>
                        <div className="comment-date">{comment.date}</div>
                        <p className="text-p m-0">
                          {comment.text.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                    </div>
                  ))}
              </div>
          </div>
      </div>
      
      <div className="footer-text">Thiết kế với 💚 và 💙 | Học Sinh</div>
    </>
  );
}
