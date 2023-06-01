<?php
/**
 * Template Name: Prioritizer
 *
 * @package Avada
 * @subpackage Templates
 */

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'Direct script access denied.' );
}
?>
<?php get_header(); ?>

<script language="JavaScript" src="https://idea-sandbox.com/wp-content/themes/Avada-Child-Theme/assets/prototype.js"></script>
<script language="JavaScript" src="https://idea-sandbox.com/wp-content/themes/Avada-Child-Theme/assets/prioritizer.js"></script>



	<?php while ( have_posts() ) : the_post(); ?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'post' ); ?>>

		<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>


			<div class="entry prioritizer-entry tools-entry">

            	<div id="float-content">
                	<?php the_content(); ?>
                </div>


                <!-- POSITION OF SANDBOX GRAPHIC -->

                <div id="prioritizer">

                    <div id="entry">
                        <h3>Step 1: Enter Your Tasks</h3>
                        <p>Enter your list of things to prioritize. Be specific!<br /><i>(use your Tab key to move from space to space)</i></p>
                        <div id="entryContainer"></div>
                    </div>
                    <div id="prioritization">
                        <h3>Step 2: Prioritize...</h3>
                        <p>Click on the item that is more important.</p>
                        <div id="prioritizationContainer"></div>
                    </div>
                    <div id="results">
                        <h3>Ta Da!: Your Priorities</h3>
                        <p>Here's the list of your priorities! You can <a href="javascript:showPrintableResultsContainer();" class="faux_link">Print It</a>, <a href="javascript: showEntryContainer();" class="faux_link">Change It</a>, or <a href="javascript: initializePrioritizer();" class="faux_link">Start Over</a>.</p>
                        <div id="resultsContainer"></div>
                    </div>

					<div id="next_button" class="faux_link">Next Step &raquo;</div>

				</div><!-- #prioritizer -->



				<div class="clearboth"></div>


		</article>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</section>
<?php do_action( 'avada_after_content' ); ?>
<?php get_footer();

/* Omit closing PHP tag to avoid "Headers already sent" issues. */
