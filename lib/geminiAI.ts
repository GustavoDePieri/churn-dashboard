import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChurnRecord, ReactivationRecord } from '@/types';

// Validate environment on module load (server-side only)
if (typeof window === 'undefined') {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Check your .env.local file.');
  }
  if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.warn('⚠️  GEMINI_API_KEY may be invalid (should start with "AIza")');
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateChurnInsights(
  churnData: ChurnRecord[],
  analysisData: any
): Promise<{ insights: string; executiveSummary: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    // Executive Summary Prompt
    const summaryPrompt = `You are a business analyst. Create a concise 3-sentence executive summary of this churn data:

Total Churns: ${analysisData.totalChurns}
Total MRR Lost: $${analysisData.totalMRRLost.toFixed(0)}
Top 3 Churn Reasons: ${analysisData.topChurnCategories.slice(0, 3).map((c: any) => `${c.category} (${c.percentage.toFixed(1)}%)`).join(', ')}
Reactivation Rate: ${analysisData.reactivationByChurnCategory.length > 0 ? analysisData.reactivationByChurnCategory[0].reactivationRate.toFixed(1) : 0}%

Format: 3 short, impactful sentences highlighting the most critical points.`;

    const summaryResult = await model.generateContent(summaryPrompt);
    const executiveSummary = summaryResult.response.text();

    // Detailed Insights Prompt
    const detailedPrompt = `You are a business analyst. Analyze this churn data using Problem → Impact → Recommendation format:

METRICS:
- Total Churns: ${analysisData.totalChurns}
- Total MRR Lost: $${analysisData.totalMRRLost.toFixed(0)}
- Avg MRR per Churn: $${analysisData.averageMRRPerChurn.toFixed(0)}
- Avg Reactivation Time: ${analysisData.averageReactivationDays.toFixed(1)} days

CHURN CATEGORIES:
${analysisData.topChurnCategories.map((c: any) => `- ${c.category}: ${c.count} churns (${c.percentage.toFixed(1)}%) - $${(c.count * analysisData.averageMRRPerChurn).toFixed(0)} MRR impact`).join('\n')}

CLIENT FEEDBACK THEMES:
${analysisData.clientFeedbackCategories?.map((c: any) => `- ${c.category}: ${c.count} mentions (${c.percentage.toFixed(1)}%)`).join('\n') || 'No feedback data'}

COMPETITOR IMPACT:
${analysisData.competitorAnalysis.map((c: any) => `- ${c.competitor}: ${c.count} churns, $${c.totalMRR.toFixed(0)} MRR lost`).join('\n')}

REACTIVATION INSIGHTS:
${analysisData.reactivationByChurnCategory.slice(0, 5).map((r: any) => `- ${r.churnCategory}: ${r.reactivationRate.toFixed(1)}% return rate, ${r.averageDaysToReactivation.toFixed(0)} days avg`).join('\n')}

Provide analysis in this exact format:

## 🔴 CRITICAL ISSUES (Highest Priority)
For each top issue:
**Problem:** [issue name] - [% of churns]
**Impact:** $[MRR lost] monthly revenue impact
**Recommendation:** [specific action item]

## 🟡 SECONDARY CONCERNS
Brief bullet points with quick fixes

## 🟢 OPPORTUNITIES
Reactivation strategies and preventive measures

## 📊 PRODUCT FEEDBACK INTEGRATION
Key themes to share with product team for dashboard sync

Keep each section concise and action-oriented.`;

    const detailedResult = await model.generateContent(detailedPrompt);
    const insights = detailedResult.response.text();

    return { insights, executiveSummary };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      insights: 'Unable to generate AI insights at this time. Please check your API configuration.',
      executiveSummary: 'Analysis unavailable.',
    };
  }
}

export async function generateProductFeedbackInsights(
  churnData: ChurnRecord[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const feedbackRecords = churnData.filter(record => record.feedback);
    
    if (feedbackRecords.length === 0) {
      return 'No product feedback available in the churn data.';
    }

    const prompt = `Analyze the following customer feedback from churned clients and provide actionable product improvement recommendations:

Feedback Data:
${feedbackRecords.map((r, i) => `${i + 1}. [${r.churnCategory}] ${r.feedback}`).join('\n\n')}

Please provide:
1. Common themes in the feedback
2. Most critical product issues mentioned
3. Feature requests or gaps identified
4. Prioritized recommendations for the product team
5. Quick wins vs long-term improvements

Format your response with clear sections and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating product feedback insights:', error);
    return 'Unable to generate product feedback insights at this time.';
  }
}

export async function generateReactivationInsights(
  reactivationData: ReactivationRecord[],
  analysisData: any
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const prompt = `You are a business analyst specializing in customer reactivation and retention. Analyze the following reactivation data and provide actionable insights:

Total Reactivations: ${analysisData.totalReactivations}
Total MRR Recovered: $${analysisData.totalMRRRecovered.toFixed(0)}
Average MRR per Reactivation: $${analysisData.averageMRR.toFixed(0)}

Top Reactivation Reasons:
${analysisData.topReactivationReasons.map((r: any) => `- ${r.category}: ${r.count} (${r.percentage.toFixed(1)}%)`).join('\n')}

Reactivations by Customer Success Path:
${analysisData.reactivationsByCSPath.map((cs: any) => `- ${cs.category}: ${cs.count} (${cs.percentage.toFixed(1)}%)`).join('\n')}

Monthly Reactivation Trend:
${analysisData.monthlyReactivations.slice(-6).map((m: any) => `- ${m.month}: ${m.count} reactivations, $${m.mrr.toFixed(0)} MRR`).join('\n')}

Please provide:
1. Key insights about reactivation patterns
2. Analysis of which factors drive successful reactivations
3. Customer Success Path effectiveness assessment
4. Recommendations to improve reactivation rates
5. Strategies to prevent future churn based on reactivation reasons
6. Financial impact analysis and projections

Format your response in clear sections with bullet points for easy reading.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating reactivation insights:', error);
    return 'Unable to generate reactivation insights at this time. Please check your API configuration.';
  }
}

