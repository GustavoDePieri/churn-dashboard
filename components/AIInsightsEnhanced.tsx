import React from 'react';

interface AIInsightsEnhancedProps {
  insights: string | null;
  isLoading?: boolean;
}

export default function AIInsightsEnhanced({ insights, isLoading }: AIInsightsEnhancedProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-brand animate-pulse"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-brand animate-ping opacity-20"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold gradient-text">AI Generating Insights...</h3>
            <p className="text-white/60 text-sm">Analyzing patterns with Gemini 2.5 Flash</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-light rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-purple-main/20 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-purple-main/10 rounded w-full mb-2"></div>
              <div className="h-3 bg-purple-main/10 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="glass rounded-2xl p-6 shadow-2xl border-coral-main/30">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-8 h-8 text-coral-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Unable to generate AI insights</h3>
        </div>
        <p className="text-white/60">Please check your API configuration and try refreshing the page.</p>
      </div>
    );
  }

  // Parse the insights text into sections
  const sections = insights.split('##').filter(s => s.trim());
  
  const getSectionIcon = (title: string) => {
    if (title.includes('CRITICAL')) return '🔴';
    if (title.includes('QUICK WINS') || title.includes('SECONDARY')) return '🟡';
    if (title.includes('OPPORTUNITIES')) return '🟢';
    if (title.includes('PRODUCT ALERTS') || title.includes('PRODUCT')) return '📊';
    return '💡';
  };

  const getSectionColor = (title: string) => {
    if (title.includes('CRITICAL')) return 'border-coral-main/40 bg-coral-main/5';
    if (title.includes('QUICK WINS') || title.includes('SECONDARY')) return 'border-yellow-500/40 bg-yellow-500/5';
    if (title.includes('OPPORTUNITIES')) return 'border-green-500/40 bg-green-500/5';
    if (title.includes('PRODUCT ALERTS') || title.includes('PRODUCT')) return 'border-purple-main/40 bg-purple-main/5';
    return 'border-pink-main/40 bg-pink-main/5';
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xl shadow-lg">
          AI
        </div>
        <div>
          <h3 className="text-2xl font-bold gradient-text">AI-Powered Insights</h3>
          <p className="text-white/60 text-sm">Powered by Google Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const lines = section.trim().split('\n');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          
          const icon = getSectionIcon(title);
          const colorClass = getSectionColor(title);

          return (
            <div key={index} className={`glass-light rounded-xl p-5 border-l-4 ${colorClass} transition-all hover:scale-[1.01]`}>
              <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                <span className="text-2xl">{icon}</span>
                <span>{title}</span>
              </h4>
              <div className="prose prose-invert prose-sm max-w-none">
                {content.split('\n\n').map((paragraph, pIndex) => {
                  if (paragraph.trim().startsWith('**Problem:**') || 
                      paragraph.trim().startsWith('**Impact:**') || 
                      paragraph.trim().startsWith('**Recommendation:**')) {
                    const [label, ...rest] = paragraph.split(':');
                    return (
                      <div key={pIndex} className="mb-3 pl-4 border-l-2 border-purple-main/30">
                        <span className="font-bold text-purple-main">{label}:</span>
                        <span className="text-white/80">{rest.join(':')}</span>
                      </div>
                    );
                  } else if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
                    return (
                      <ul key={pIndex} className="space-y-2 ml-4">
                        {paragraph.split('\n').filter(line => line.trim()).map((item, iIndex) => (
                          <li key={iIndex} className="text-white/80 leading-relaxed">
                            {item.replace(/^[-•]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  } else {
                    return (
                      <p key={pIndex} className="text-white/80 leading-relaxed mb-3 whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

