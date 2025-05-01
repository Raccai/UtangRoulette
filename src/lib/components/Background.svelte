<script>
  import JeepneyBG from "../assets/images/JeepneyBG.png";
</script>

<div 
  class="jeepney-background" 
  aria-hidden="true"
>
  <!-- Image is a background-image for better control (check css below) -->
</div>

<style>
  .jeepney-background {
    position: fixed;
    inset: 0; /* Cover viewport */
    z-index: -1; /* Position behind content */
    background-color: var(--bg-dark-blue, #1A3A4F); /* Base color */
    overflow: hidden; /* Prevent scrollbars */
    pointer-events: none; /* Non-interactive */
  }

  /* Use a pseudo-element for the image layer */
  .jeepney-background::before {
    content: '';
    position: absolute;
    inset: 0; /* Cover the container */
    background-size: cover; /* Cover the area, might crop */
    background-position: center center; /* Center the image */
    background-repeat: no-repeat;
    background-image: url('../assets/images/JeepneyBG.png');

    /* --- Adjust Opacity and Contrast/Filters --- */
    opacity: 0.2; /* Low for subtlety (adjust 0.05 - 0.15) */

    /* Apply filters to the image layer before opacity reduces its overall impact */
    /* Increase contrast, maybe slightly adjust brightness, optional grayscale */
    filter: contrast(160%) brightness(85%) grayscale(30%);

    /* --- Blend Mode (Experiment!) --- */
    /* How the image layer interacts with the blue background underneath */
    /* mix-blend-mode: luminosity; */ /* Uses image brightness, keeps background color - very subtle */
    mix-blend-mode: overlay; /* Blends light/dark areas - often good for texture */
    /* mix-blend-mode: multiply; */ /* Darkens the background based on image */
    /* mix-blend-mode: screen; */ /* Lightens the background based on image */

    z-index: 1; /* Ensure it's above the base color but below content */
  }

  /* Use another pseudo-element for the texture overlay */
  .jeepney-background::after {
    content: '';
    position: absolute;
    inset: 0;

    /* --- Subtle Noise Texture using CSS Gradient --- */
    /* Adjust alpha (last value) for texture visibility */
    background-image: linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), /* Slight white noise */
                      linear-gradient(90deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)); /* Slight dark noise */
    background-size: 2px 1px, 1px 2px; /* Creates fine noise pattern */

    /* OR use a noise texture image in the future*/
    /* background-image: url('/path/to/noise-texture.png'); */
    /* background-repeat: repeat; Not ideal ngl */

    /* How the texture blends */
    mix-blend-mode: overlay; /* Overlay often works well for noise */
    opacity: 0.5; /* Adjust overall texture strength */
    z-index: 2; /* Place texture above the image layer */
  }
</style>