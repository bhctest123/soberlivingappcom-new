# Claude Code Onboarding Prompt

Copy and paste this prompt when starting a new Claude Code session:

---

I'm working on the Sober Living App website migration project. The migration is 100% complete and production-ready. To get up to speed on the project, please read these key files in order:

1. **Project Overview & Current Status**:
   - Read `/CLAUDE.md` - This is your primary guide with project overview, completion status, and coding guidelines
   - Read `/MIGRATION_PLAN.md` - Detailed migration plan showing all completed phases and post-migration enhancements

2. **Recent Enhancements** (July 28, 2025):
   - Read `/FEATURE_ENHANCEMENTS_SUMMARY.md` - Summary of the latest feature page improvements
   - Read `/src/styles/STYLE_GUIDE.md` - Visual design system documentation
   - Review `/src/styles/features.css` - Global styles implementation

3. **Project Structure**:
   - `/soberlivingappcom-new/` - The new website (this is where we work)
   - `/soberlivingappcom-current-sitesucker/` - Original Squarespace site (reference only)

4. **Key Components to Understand**:
   - `/src/components/features/FeatureTourNav.astro` - Interactive feature navigation system
   - `/src/layouts/FeatureLayout.astro` - Template for all feature pages
   - `/src/pages/features/index.astro` - Main features listing page

5. **Blog System** (if working on blog):
   - `/src/content/sober-living-app-blog/` - 146 migrated blog posts
   - Review the blog URL QA reports if needed

6. **Development Commands**:
   ```bash
   cd soberlivingappcom-new
   npm install  # If needed
   npm run dev  # Start dev server on http://localhost:4321
   ```

The website is for Behave Health's Sober Living App - software for managing recovery residences. We've successfully migrated from Squarespace to Astro with zero SEO loss, enhanced the visual design system, and added interactive features.

What specific area would you like to work on today?

---

## Additional Context for Complex Tasks

If working on specific areas, also mention:

- **For SEO work**: "Check the SEO preservation details in CLAUDE.md and the QA reports"
- **For styling**: "Review the design system in STYLE_GUIDE.md and features.css"
- **For feature pages**: "Look at the Feature Tour Navigation system and FeatureLayout"
- **For blog**: "Check the blog migration section in MIGRATION_PLAN.md"

## Quick Status Summary to Include

"The project status is: Migration 100% complete, all 625 blog URLs preserved, 30+ feature pages enhanced with consistent styling, Feature Tour Navigation implemented, and the site is production-ready for Netlify deployment."