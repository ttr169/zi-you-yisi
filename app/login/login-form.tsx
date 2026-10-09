'use client';

import { useState } from 'react';
import { BookOpen, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (working) return;
    setWorking(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        setError(body.error || '登录暂时没有成功，请稍后重试。');
        return;
      }
      window.location.assign('/');
    } catch { setError('网络暂时不可用，请检查连接后重试。'); }
    finally { setWorking(false); }
  }

  return <main className="login-page"><div className="login-illustration" aria-hidden="true"><span className="login-sun"/><span className="login-mountain back"/><span className="login-mountain front"/><BookOpen size={96} strokeWidth={1.2}/></div><section className="login-panel"><div className="login-brand"><span className="brand-icon">字</span><span>字有意思<small>每天，读懂一点点</small></span></div><p className="eyebrow"><span className="tiny-dot"/> 欢迎回到语文小天地</p><h1>继续读，<br/>继续发现<span>。</span></h1><p className="login-subtitle">请使用家长指定的邮箱和密码登录。学习记录会跟着账号，在不同设备上接着学。</p><form onSubmit={submit}><label htmlFor="login-email">邮箱</label><input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required placeholder="请输入指定邮箱"/><label htmlFor="login-password">密码</label><div className="password-field"><input id="login-password" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="请输入密码"/><button type="button" aria-label={showPassword?'隐藏密码':'显示密码'} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>{error&&<p className="login-error" role="alert">{error}</p>}<button type="submit" className="primary" disabled={working}>{working?'正在登录':'进入我的小课本'} <ArrowRight size={18}/></button></form><p className="login-note">只有获准的邮箱可以进入。请向家长询问登录信息。</p></section></main>;
}
