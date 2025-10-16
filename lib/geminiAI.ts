import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChurnRecord, ReactivationRecord } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateChurnInsights(
  churnData: ChurnRecord[],
  analysisData: any
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-exp' });

    const prompt = `You are a business analyst specializing in customer churn analysis. Analyze the following churn data and provide actionable insights:

Total Churns: ${analysisData.totalChurns}
Average Reactivation Time: ${analysisData.averageReactivationDays.toFixed(1)} days

Top Churn Categories:
${analysisData.topChurnCategories.map((c: any) => `- ${c.category}: ${c.count} (${c.percentage.toFixed(1)}%)`).join('\n')}

Top Service Categories:
${analysisData.topServiceCategories.map((c: any) => `- ${c.category}: ${c.count} (${c.percentage.toFixed(1)}%)`).join('\n')}

Competitor Analysis:
${analysisData.competitorAnalysis.map((c: any) => `- ${c.competitor}: ${c.count} churns, $${c.totalMRR.toFixed(0)} total MRR, $${c.averagePrice.toFixed(0)} avg price`).join('\n')}

Reactivation Correlation:
${analysisData.reactivationByChurnCategory.map((r: any) => `- ${r.churnCategory}: ${r.reactivationRate.toFixed(1)}% reactivation rate, ${r.averageDaysToReactivation.toFixed(0)} days avg`).join('\n')}

Please provide:
1. Key insights about churn patterns
2. Analysis of which churn categories are most likely to return
3. Competitor threat assessment
4. Recommendations to reduce churn
5. Strategies to improve reactivation rates

Format your response in clear sections with bullet points for easy reading.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return 'Unable to generate AI insights at this time. Please check your API configuration.';
  }
}

export async function generateProductFeedbackInsights(
  churnData: ChurnRecord[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-exp' });

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
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-exp' });

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

