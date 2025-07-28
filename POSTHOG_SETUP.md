# PostHog Analytics Setup

PostHog has been integrated into the Sober Living App website for analytics tracking.

## Important Security Note

To prevent API key exposure in the build output, PostHog should be configured through your hosting platform's environment variables or server-side configuration, NOT through client-side environment variables.

## Configuration Options

### Option 1: Server-Side Script Injection (Recommended)

Configure PostHog through your hosting platform:

**Netlify:**
1. Go to Site Settings → Build & Deploy → Post Processing
2. Add a snippet injection for `</head>`:
```html
<script>
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('YOUR_API_KEY',{api_host:'https://app.posthog.com'})
</script>
```

**Vercel:**
Use similar approach with script injection in vercel.json

### Option 2: Direct Script Tag

Add PostHog directly to your HTML template with the API key:

1. **Get your PostHog API key**:
   - Sign up or log in at [PostHog](https://app.posthog.com)
   - Go to Project Settings → API Keys
   - Copy your Project API Key

2. **Add to your site**:
   - Use your hosting platform's script injection feature
   - Or add through a custom HTML component (not recommended as it may expose the key)

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