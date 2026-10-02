# Restore Cole's PPT Drawn Circles on Corner and Edge Pieces

**Summary:**
- Restored Cole's hand-drawn red circles on corner and edge pieces across the presentation viewer and photo gallery in `guide.html` ("How It Works & Finger Tricks"):
  - Extracted OpenXML DrawingML stroke and transform coordinates from `slide2.xml` (Ink 9 & Ink 11, `image4.png` / `image5.png`) and `slide3.xml` (Ink 4, `image7.png`).
  - Composited Cole's exact red ink circle drawings onto `media/guide_ppt/image3.jpeg` (Corner piece) and `media/guide_ppt/image4.jpeg` (Edge piece) at sub-pixel accuracy.
  - Added Cole's authentic hand-drawn spider core diagram (`center_core_drawing.png`) to Slide 5 ("Center Cores") with clear labels for the 6-axis core and attached centers.
  - Updated captions and badges in Slide 2, Slide 3, Slide 5, and the Section 1 Anatomy Photo Gallery.
  - Verified JavaScript parsing, image existence, and responsive styling.

Status: COMPLETE
Goal / Definition of done:
1. Extract Cole's hand-drawn ink circles from PPTX DrawingML (`slide2.xml` and `slide3.xml`).
2. Composite the circles onto the corner and edge piece images at the exact coordinates.
3. Update `guide.html` slides and gallery to show the circled pieces and Cole's hand-drawn center core diagram.
4. Verify all image links and JS syntax.
5. Commit and push changes to `origin main`.

Next step: Completed and pushed to origin main.
Tasks:
- [x] Inspect slide2.xml and slide3.xml DrawingML transforms and embedded ink PNGs
- [x] Composite Cole's drawn circles onto corner (`image3.jpeg`) and edge (`image4.jpeg`) photos
- [x] Extract and render Cole's hand-drawn center core diagram for Slide 5
- [x] Update Slide 2, Slide 3, Slide 5, and Anatomy Gallery in `guide.html`
- [x] Verify images and JavaScript syntax
- [x] Commit and push to origin main

Assumptions:
- "ppt's circles that i put on the corner and edges are gone" refers to the digital ink strokes (`image4.png`, `image5.png`, `image7.png`) that Cole drew on top of the corner and edge pieces in PowerPoint, which were missing from the raw photo extractions.

Blockers (what I need to do):
- None.

Found, not done:
- None.

Log (newest first, one line each):
- Restored Cole's PPT drawn circles on corner and edge pieces, added hand-drawn center core diagram, verified and pushed to origin main
- Removed intermediate words, tip banner, solves badge, and hub cards between top buttons and Battle Timer in index.html; verified and pushed to origin main
- Integrated Cole's new PowerPoint presentation into guide.html with interactive slide viewer, photo gallery, finger tricks, verified and pushed to origin main
- Upgraded case trainer with Next Case buttons across setup and workspace, guaranteed different case selection, verified and pushed to origin main
