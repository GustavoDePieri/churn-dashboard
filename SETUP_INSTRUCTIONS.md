# Setup Instructions

## Environment Variables Setup

Create a `.env.local` file with your credentials:

```env
# Google Gemini AI API Key
GEMINI_API_KEY=AIzaSyDTSQMAOh_6o8qctMAmOTbH0RPXz1xd0wc

# Google Sheets Configuration
GOOGLE_SHEETS_ID=1HTlc5fgzdfR_b0DSUNseI1iZkGdhljU_AgjkNzztz0A
GOOGLE_SHEETS_TAB=All-history-churns

# Google Service Account (for Sheets API)
GOOGLE_SERVICE_ACCOUNT_EMAIL=whatsappvalidaor@omega-cosmos-469700-v8.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6e3uQuKYM8+XB\nouBddLE5Z9uWeFBCRs4b+kEj1YE1OgnPxloc4gKYgEIVrRhJyoDctC/eO6+Vq19e\noTdvsjE7Uvt7bjYPEwUSS2BGfs3YMQi96ilzoJ6LWLZRwIl5rXm5xjBRR5zmtYyX\njM0ikBMggjaM5kkjd0HgR3cHXVBxW9rXslehFS0Zzacvrkx6j6wQmfJk104+8jdT\nIACUwIemKe/kWeZ75IQXFodNVVjDeqAmYjhrNd43sgwHaXo064qrtaft7b3xl71R\nThetCojhN8x6XNYfO9J0Oostzmnkw8R6MTh2C9Fj1pvc98iqMXIXUpnErU+QY5FW\nK+51GZ1jAgMBAAECggEAAwBH8Bkz1um5ho29laA/CYD4SDbxRISWMZFFj7MsBdrE\nW9soPRnBpLzZRp1tn1ZkD4LScf2jT3UEFZl7mZxHbY1Ibc3LjrklvKWI5Zy9ArmU\n5FWKsdX7NAJLLaXVfVqDQHzSvAqIGTBnx4XLd77UB/kzsb3NBIYy6BsBhkiEQ5nw\nF634A7WmITXBfB7SfhngYgEh+m/Ci68Xt8gTEUswEZfT/KpAl4WDHLvmI3qmBgT9\nWlGDrBI/fvGu3JGKWEhidh3x9WEwf+KWCVOl6Pd1OY2whnR+vPYNO7a6TbGPBiFi\na5VtokaTGYEOYxAs04xUk8q2NFye+TTVQoTLmF9zdQKBgQDlawWUFQcHCyMBXj7w\ns7IZrwKaI1rgjnZ7Zdbrp5mCrhIyBwl8ap4bTJfqtz9vwv+/MBiDh4OZGr3vSSCo\nkAzNBRLyYZE1TGBvW9yRcplA3md7CswH1SfTVebeGFwXImunf27TGAiljUlaWhSg\nCiAVP4fzL/wJPaaNDc2zVx/6ZwKBgQDQFufqulPAiUT/Hyc30ul+UAndnYRxUc/i\nvpyXQInjvra656s6O62CiF/EqkiEbNpGkGBhFKYRqGD44W4lf8yTDXnKwZpu5g0E\nVnavdp8PmXG1t9f5T35JTZH6mrXxENa6wdpyD4m3958S7ZLFd53LyUeIWA3XOOMC\n1oq3+0dfpQKBgQCJjjzfCCiZiYzoohi8/BGaoru9rdssb18NKAfQbkJ1/2c7hcqj\nRc4c8jTYcB1iJppviSf5nURDhaxCkCc7yntSZmtw1x1Yxr2/p2W98+d95JxJQzUI\nsT7a0VPG8PYujN3dpWPOwEdW9Dr6KK7bMpcABoK+RpQo+kUlqBQhJukumwKBgGv+\nN0YehTC7DM/KfzP9hahEKZqWERIuf1ER03q7x9QmOfcuHDMQna/MzsbmCNSRGYbd\njudTLAyl8g24EM3tUWJP8BFGALvlMIQ7y0Ssr0gNPnIsgy2kD8pDM6t3d00wjABI\ncvIXFkYfgLL2EOHifkYwo6si56v2nfnvFfb9tcDxAoGAGrBaeENeo9LiqYEWR1kG\nBN8JsNDkBOtWye31rbP3mpAfchkN0lauhjow6iOQ7sOO0N0HSjBPSZylM5CDEYrQ\nl3RLOHwBmA2IOv6pG5oGUcZbfpoubxu3lEleA+brTd5PfPgSWVDxV8NkByHVLF18\nY7bYQ6NUD5jTZd54G4xxODg=\n-----END PRIVATE KEY-----\n"
```

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable from above
4. Make sure to select all environments (Production, Preview, Development)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with the credentials above

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Important Notes

- The `.env.local` file is gitignored for security
- Never commit API keys or credentials to version control
- Make sure your Google Service Account has access to the Google Sheet
- The sheet must have the correct column format (see README.md)

