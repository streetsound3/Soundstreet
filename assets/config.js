/*
  Sound Street Research: site settings.
  This is the only file you need to edit to turn the forms on.

  substackUrl     Your Substack address, e.g. "https://soundstreet.substack.com".
                  The Subscribe form sends readers there to confirm.
  sampleEndpoint  Your Formspree form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
                  The "Send me the sample" forms post to it, and Formspree emails you.

  sampleEmail     Where advisor sample requests go when there's no Formspree endpoint,
                  split in two to keep it away from spam bots: ["yourname", "gmail.com"].
                  The form opens the advisor's email app with the request written out.

  Leave a value empty ("") and that form tells visitors it isn't open yet.
*/
window.SOUND_STREET = {
  substackUrl: "https://soundstreetresearch.substack.com",
  sampleEndpoint: "",
  sampleEmail: ["", ""]
};
