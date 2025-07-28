# PostHog Analytics Setup

PostHog has been integrated into the Sober Living App website for analytics tracking.

## Configuration

1. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Get your PostHog API key**:
   - Sign up or log in at [PostHog](https://app.posthog.com)
   - Go to Project Settings → API Keys
   - Copy your Project API Key

3. **Update the .env file**:
   ```
   PUBLIC_POSTHOG_API_KEY=your_actual_api_key_here
   PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

   For EU cloud users, use:
   ```
   PUBLIC_POSTHOG_HOST=https://eu.posthog.com
   ```

## Features Enabled

- **Automatic pageview tracking**: Every page visit is tracked
- **Autocapture**: Automatically captures clicks, form submissions, and other interactions
- **Session recording**: Records user sessions (with input masking for privacy)
- **Page leave tracking**: Tracks when users leave pages
- **Debug mode**: Enabled in development for easier troubleshooting

## Privacy Considerations

- All form inputs are masked in session recordings for privacy
- Text content is not masked to allow for better insights
- Make sure to comply with your privacy policy and local regulations

## Usage

PostHog is automatically initialized on every page through the BaseLayout component. No additional setup is required on individual pages.

### Custom Events

To track custom events in your components:

```javascript
import { posthog } from '@/lib/posthog';

// Track an event
posthog.capture('button_clicked', {
  button_name: 'signup',
  location: 'hero_section'
});
```

### Identify Users

To identify logged-in users:

```javascript
import { posthog } from '@/lib/posthog';

// When user logs in
posthog.identify('user-id', {
  email: 'user@example.com',
  name: 'John Doe'
});
```

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser's developer console
3. You should see PostHog debug messages in development mode
4. Navigate around the site and check the Network tab for PostHog API calls

## Production Deployment

Make sure to set the environment variables in your production environment:
- Netlify: Add them in the Environment Variables section
- Vercel: Add them in the Environment Variables settings
- Other hosts: Follow their specific documentation

## Troubleshooting

- If PostHog isn't loading, check that the API key is set correctly
- Check the browser console for any error messages
- Ensure the PostHog host URL is correct for your region
- In development, debug mode will provide detailed logs