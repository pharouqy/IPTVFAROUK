# Advertising Setup Guide

This guide will help you set up advertising networks for your IPTV application.

## A-Ads (Anonymous Ads) - Crypto Ad Network

A-Ads is a cryptocurrency-focused ad network that doesn't require approval and pays in Bitcoin.

### Setup Steps

1. **Create Account**
   - Visit [https://a-ads.com](https://a-ads.com)
   - Sign up for a publisher account

2. **Create Ad Unit**
   - Go to "Campaigns" → "Create Ad Unit"
   - Choose ad size (recommended: 728x90 for banners)
   - Copy your Ad Unit ID (7-digit number)

3. **Configure Environment**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Ad Unit ID:
     ```
     VITE_AADS_BANNER_ID=2418929
     ```

4. **Test Integration**
   - Restart your dev server: `npm run dev`
   - Disable ad blocker temporarily
   - Check browser console for "✅ A-Ads chargé" message
   - You should see your ad displayed

### Ad Unit ID Format

Your A-Ads code looks like this:
```html
<iframe data-aa='2418929' src='//ad.a-ads.com/2418929/?size=728x90'></iframe>
```

The number `2418929` is your Ad Unit ID - use this in your `.env` file.

### Important Notes

⚠️ **Ad Blockers**: Most ad blockers will block A-Ads. The app automatically shows fallback ads (Premium, Share, etc.) when ads are blocked.

✅ **No Approval Required**: Unlike AdMaven, A-Ads works immediately after account creation.

💰 **Payment**: A-Ads pays in Bitcoin. Set up your wallet in your A-Ads account settings.

## AdMaven (Optional)

AdMaven offers higher CPM rates but requires approval.

### Setup Steps

1. **Apply for Account**
   - Visit [https://publishers.admaven.com](https://publishers.admaven.com)
   - Submit your application
   - Wait for approval (1-3 days)

2. **Get Ad Unit IDs**
   - Once approved, create ad units
   - Copy your IDs for banner, video, interstitial, and popunder

3. **Configure Environment**
   - Add to `.env`:
     ```
     VITE_ADMAVEN_BANNER_ID=your_banner_id
     VITE_ADMAVEN_VIDEO_ID=your_video_id
     VITE_ADMAVEN_INTERSTITIAL_ID=your_interstitial_id
     VITE_ADMAVEN_POPUNDER_ID=your_popunder_id
     ```

4. **Enable in Config**
   - Edit `src/config/ads.js`
   - Set `admaven.enabled: true`

## Testing

### With Ad Blocker Disabled
```bash
npm run dev
```
- Open browser console (F12)
- Look for: "✅ A-Ads chargé: 2418929"
- Ad should display in banner area

### With Ad Blocker Enabled
- Console will show: "❌ Erreur chargement A-Ads"
- Fallback ad should display automatically
- This is expected behavior

## Troubleshooting

### "Using default ID" warning
- Check `.env` file exists
- Verify `VITE_AADS_BANNER_ID` is set
- Restart dev server after changing `.env`

### Ads not showing
1. Disable ad blocker
2. Check browser console for errors
3. Verify Ad Unit ID is correct
4. Check A-Ads dashboard for ad unit status

### ERR_BLOCKED_BY_CLIENT
- This means ad blocker is active
- Fallback ads will show instead
- This is normal and expected

## Revenue Optimization

1. **Use Both Networks**: Enable both A-Ads and AdMaven for maximum fill rate
2. **Strategic Placement**: Banner ads at top, video prerolls every 2 streams
3. **Monitor Performance**: Check A-Ads dashboard regularly
4. **User Experience**: Don't overwhelm users with too many ads

## Support

- A-Ads Support: [https://a-ads.com/support](https://a-ads.com/support)
- AdMaven Support: publishers@admaven.com
