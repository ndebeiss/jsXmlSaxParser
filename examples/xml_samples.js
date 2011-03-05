function loadXml() {

return "<?xml version=\"1.0\"?> \
		<rootmarkup id=\"wer\" type=\"eg\"> \
			<firstmarkupunderroot>efs</firstmarkupunderroot> \
			<secondmarkupunderroot name=\"we\"> \
				<firstchoice choice=\"sf\"/> \
			</secondmarkupunderroot> \
		</rootmarkup>";

}

function loadRelaxng() {

return "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<rng:grammar xmlns:a=\"http://relaxng.org/ns/compatibility/annotations/1.0\" xmlns:rng=\"http://relaxng.org/ns/structure/1.0\" ns=\"\" \ datatypeLibrary=\"http://www.w3.org/2001/XMLSchema-datatypes\"> \
	<rng:start> \
		<rng:ref name=\"rootmarkup\"/> \
	</rng:start> \
	<rng:define name=\"rootmarkup\"> \
		<rng:element name=\"rootmarkup\"> \
			<a:documentation>Comment describing rootMarkup</a:documentation> \
			<rng:element name=\"firstmarkupunderroot\"> \
				<rng:data type=\"string\"/> \
			</rng:element> \
			<rng:element name=\"secondmarkupunderroot\"> \
				<rng:choice> \
					<rng:element name=\"firstchoice\"> \
						<rng:ref name=\"fstchoice\"/> \
					</rng:element> \
					<rng:element name=\"secondchoice\"> \
						<rng:ref name=\"sndchoice\"/> \
					</rng:element> \
				</rng:choice> \
				<rng:attribute name=\"name\"> \
					<rng:data type=\"string\"/> \
				</rng:attribute> \
			</rng:element> \
			<rng:attribute name=\"id\"> \
				<rng:data type=\"integer\"/> \
			</rng:attribute> \
			<rng:attribute name=\"type\"> \
				<rng:data type=\"string\"/> \
			</rng:attribute> \
		</rng:element> \
	</rng:define> \
	<rng:define name=\"fstchoice\"> \
		<rng:attribute name=\"choice\"> \
			<rng:data type=\"string\"/> \
		</rng:attribute> \
	</rng:define> \
	<rng:define name=\"sndchoice\"> \
		<rng:element name=\"name\"> \
			<rng:ref name=\"stringtype\"/> \
		</rng:element> \
		<rng:element name=\"address\"> \
			<rng:ref name=\"stringtype\"/> \
		</rng:element> \
		<rng:element name=\"city\"> \
			<rng:ref name=\"city\"/> \
		</rng:element> \
		<rng:element name=\"country\"> \
			<rng:ref name=\"country\"/> \
		</rng:element> \
		<rng:element name=\"age\"> \
			<rng:ref name=\"age\"/> \
		</rng:element> \
		<rng:attribute name=\"choice\"> \
			<rng:data type=\"string\"/> \
		</rng:attribute> \
	</rng:define> \
	<rng:define name=\"stringtype\"> \
		<rng:data type=\"string\"/> \
	</rng:define> \
	<rng:define name=\"city\"> \
		<rng:data type=\"string\"> \
			<rng:param name=\"xs:pattern\">[a-zA-Z][a-zA-Z][a-zA-Z]</rng:param> \
		</rng:data> \
	</rng:define> \
	<rng:define name=\"country\"> \
		<rng:choice> \
			<rng:value>FR</rng:value> \
			<rng:value>GB</rng:value> \
			<rng:value>IT</rng:value> \
		</rng:choice> \
	</rng:define> \
	<rng:define name=\"age\"> \
		<rng:data type=\"integer\"> \
			<rng:param name=\"xs:minInclusive\">0</rng:param> \
			<rng:param name=\"xs:maxInclusive\">120</rng:param> \
		</rng:data> \
	</rng:define> \
</rng:grammar>";

}


function loadXml2() {

return "<?xml version=\"1.0\"?> \
		<bch:benchmark xmlns:bch=\"http://benchmark\" id=\"EnRo66_Fig1_X\" version=\"0.1\"> \
			<bch:description>Responses of an off-centre X-cell in cat retina to the introduction and withdrawal of a \
				stationary sinusoidal grating pattern, with four different spatial phases, from Figure 1 of \
				Enroth-Cugell and Robson (1966) J. Physiol. 187: 517-552.</bch:description> \
			<bch:recording> \
				<bch:brain-region> \
					<bch:retina measureable=\"spikes\"> \
						<bch:layer_1> \
							<bch:ganglion_cell_layer celltypes=\"Y-OFF X-ON X-OFF\"/> \
						</bch:layer_1> \
					</bch:retina> \
				</bch:brain-region> \
			</bch:recording> \
			<bch:analysis difference-measure=\"root-mean-square\"> \
				<bch:stage> \
					<bch:spike_histogram> \
						<bch:parameter name=\"binwidth\" value=\"20.0\" units=\"ms\"/> \
					</bch:spike_histogram> \
				</bch:stage> \
				<bch:stage> \
					<bch:raster_plot> \
						<bch:parameter name=\"raster_parameter\" value=\"20.0\" units=\"ms\"/> \
					</bch:raster_plot> \
				</bch:stage> \
			</bch:analysis> \
			<bch:protocols> \
				<bch:protocol id=\"Phase0deg\" repetitions=\"50\" weight=\"1.0\" duration=\"2000.0\"> \
					<bch:stimulus_file scale-factor=\"5.0\" max-luminance=\"1.0\" \
						img=\"c:/Benchmarks/Stimuli/phase0deg.zip\"/> \
					<bch:comparison-data \
						url=\"c:/EnRo66_Fig1_X/EnRo66_fig1_Xcells_0deg.dat\"/> \
				</bch:protocol> \
				<bch:protocol id=\"Phase90deg\" repetitions=\"50\" weight=\"1.0\" duration=\"2000.0\"> \
					<bch:stimulus_file scale-factor=\"5.0\" max-luminance=\"1.0\" \
						img=\"c:/Stimuli/phase90deg.zip\"/> \
					<bch:comparison-data \
						url=\"c:/EnRo66_fig1_Xcells_90deg.dat\"/> \
				</bch:protocol> \
			</bch:protocols> \
			 \
		</bch:benchmark>";
		
}

function loadRelaxng2() {
return "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
		<rng:grammar \
			xmlns:rng=\"http://relaxng.org/ns/structure/1.0\" \
		    xmlns:a=\"http://relaxng.org/ns/compatibility/annotations/1.0\" \
			xmlns:bch=\"http://benchmark\" \
		    datatypeLibrary=\"http://www.w3.org/2001/XMLSchema-datatypes\"> \
		    <rng:start> \
		        <rng:ref name=\"benchmark\"/> \
		    </rng:start> \
		    \
		    \
		    <rng:define name=\"benchmark\"> \
		        <a:documentation> \
		            <style type=\"text/css\"> \
		                div [id=\"form\"] .element[name=\"/benchmark\"] { \
		                    font-size: 18px; \
		                    font-weight: bold; \
		                } \
					</style> \
		        </a:documentation> \
		        <rng:element name=\"bch:benchmark\"> \
		            <rng:attribute name=\"id\"> \
		                <rng:data type=\"string\"/> \
		            </rng:attribute> \
		            <rng:attribute name=\"version\"> \
		                <rng:data type=\"string\"/> \
		            </rng:attribute> \
		            <rng:element name=\"bch:description\"> \
		                <rng:text/> \
		            </rng:element> \
		            <rng:ref name=\"recording\"/> \
		            <rng:ref name=\"analysis\"/> \
		            <rng:ref name=\"protocols\"/> \
		        </rng:element> \
		         \
		    </rng:define> \
		     \
		    <rng:define name=\"recording\"> \
		        <rng:element name=\"bch:recording\"> \
		            <rng:element name=\"bch:brain-region\"> \
		                <rng:choice> \
		                    <rng:ref name=\"retina\"/> \
		                    <rng:ref name=\"cerebellum\"/> \
		                </rng:choice> \
		            </rng:element> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"retina\"> \
		        <rng:element name=\"bch:retina\"> \
		            <rng:attribute name=\"measureable\"> \
		                <rng:choice> \
		                    <rng:value>spikes</rng:value> \
		                    <rng:value>current</rng:value> \
		                </rng:choice> \
		            </rng:attribute> \
		             \
		            <rng:element name=\"bch:layer_1\"> \
		                <rng:element name=\"bch:ganglion_cell_layer\"> \
		                    <rng:ref name=\"celltype\"/> \
		                </rng:element> \
		            </rng:element> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"celltype\"> \
		        <rng:attribute name=\"celltypes\"> \
		            <rng:list> \
		                <rng:zeroOrMore> \
		                    <rng:choice> \
		                        <rng:value>X-ON</rng:value> \
		                        <rng:value>X-OFF</rng:value> \
		                        <rng:value>Y-ON</rng:value> \
		                        <rng:value>Y-OFF</rng:value> \
		                    </rng:choice> \
		                </rng:zeroOrMore> \
		            </rng:list> \
		        </rng:attribute> \
		    </rng:define> \
		     \
		    <rng:define name=\"cerebellum\"> \
		        <rng:element name=\"bch:cerebellum\"> \
		            <rng:attribute name=\"measureable\"> \
		                <rng:choice> \
		                    <rng:value>spikes</rng:value> \
		                    <rng:value>current</rng:value> \
		                </rng:choice> \
		            </rng:attribute> \
		             \
		            <rng:element name=\"bch:layer_1\"> \
		                <rng:element name=\"bch:ganglion_cell_layer\"> \
		                    <rng:ref name=\"celltype\"/> \
		                </rng:element> \
		            </rng:element> \
		            <rng:element name=\"bch:layer_2\"> \
		                <rng:element name=\"bch:ganglion_cell_layer_2\"> \
		                    <rng:ref name=\"celltype\"/> \
		                </rng:element> \
		            </rng:element> \
		        </rng:element> \
		    </rng:define> \
		     \
		     \
		    <rng:define name=\"analysis\"> \
		        <rng:element name=\"bch:analysis\"> \
		            <rng:attribute name=\"difference-measure\"> \
		                <rng:choice> \
		                    <rng:value>root-mean-square</rng:value> \
		                    <rng:value>mean-square</rng:value> \
		                </rng:choice> \
		            </rng:attribute> \
		            <rng:oneOrMore> \
		                <rng:element name=\"bch:stage\"> \
		                    <rng:choice> \
		                        <rng:ref name=\"spike_histogram\"/> \
		                        <rng:ref name=\"raster_plot\"/> \
		                    </rng:choice> \
		                </rng:element> \
		            </rng:oneOrMore> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"spike_histogram\"> \
		        <rng:element name=\"bch:spike_histogram\"> \
		            <rng:element name=\"bch:parameter\"> \
		                <rng:attribute name=\"name\"> \
		                    <rng:value>binwidth</rng:value> \
		                </rng:attribute> \
		                <rng:attribute name=\"value\"> \
		                    <rng:data type=\"float\"/> \
		                </rng:attribute> \
		                <rng:ref name=\"units\"/> \
		            </rng:element> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"raster_plot\"> \
		        <rng:element name=\"bch:raster_plot\"> \
		            <rng:element name=\"bch:parameter\"> \
		                <rng:attribute name=\"name\"> \
		                    <rng:value>raster_parameter</rng:value> \
		                </rng:attribute> \
		                <rng:attribute name=\"value\"> \
		                    <rng:data type=\"float\"/> \
		                </rng:attribute> \
		                <rng:ref name=\"units\"/> \
		            </rng:element> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"protocols\"> \
		        <rng:element name=\"bch:protocols\"> \
		            <rng:oneOrMore> \
		                <rng:element name=\"bch:protocol\"> \
		                    <rng:attribute name=\"id\"> \
		                        <rng:data type=\"string\"/> \
		                    </rng:attribute> \
		                    <rng:attribute name=\"repetitions\"> \
		                        <rng:data type=\"integer\"/> \
		                    </rng:attribute> \
		                    <rng:attribute name=\"weight\"> \
		                        <rng:data type=\"float\"/> \
		                    </rng:attribute> \
		                    <rng:attribute name=\"duration\"> \
		                        <rng:data type=\"float\"/> \
		                    </rng:attribute> \
		                    <rng:element name=\"bch:stimulus_file\"> \
		                        <rng:attribute name=\"scale-factor\"> \
		                            <rng:data type=\"float\"/> \
		                            <a:documentation> \
		                                pixels/degree \
		                            </a:documentation> \
		                        </rng:attribute> \
		                        <rng:attribute name=\"max-luminance\"> \
		                            <rng:data type=\"float\"/> \
		                            <a:documentation> \
		                                cd/m² \
		                            </a:documentation> \
		                        </rng:attribute> \
		                        <rng:attribute name=\"img\"> \
		                            <rng:data type=\"anyURI\"/> \
		                        </rng:attribute> \
		                    </rng:element> \
		                    <rng:element name=\"bch:comparison-data\"> \
		                        <rng:choice> \
		                            <rng:ref name=\"url\"/> \
		                            <rng:ref name=\"value\"/> \
		                        </rng:choice> \
		                    </rng:element> \
		                </rng:element> \
		            </rng:oneOrMore> \
		        </rng:element> \
		    </rng:define> \
		     \
		    <rng:define name=\"url\"> \
		        <rng:attribute name=\"url\"> \
		            <rng:data type=\"anyURI\"/> \
		        </rng:attribute> \
		    </rng:define> \
		     \
		    <rng:define name=\"value\"> \
		        <rng:attribute name=\"value\"> \
		            <rng:data type=\"string\"/> \
		        </rng:attribute> \
		        <rng:ref name=\"units\"/> \
		    </rng:define> \
		     \
		    <rng:define name=\"units\"> \
		        <rng:attribute name=\"units\"> \
		            <rng:choice> \
		                <rng:value>ms</rng:value> \
		                <rng:value>s</rng:value> \
		            </rng:choice> \
		        </rng:attribute> \
		    </rng:define> \
		</rng:grammar>";
		
}

function loadXml3() {

return "<?xml version=\"1.0\"?> \
		<bch:benchmark xmlns:bch=\"http://benchmark\"> \
			<bch:recording celltypes=\"Y-OFF X-ON X-OFF\"> \
			</bch:recording> \
			<bch:protocols/> \
		</bch:benchmark>";

}

function loadRelaxng3() {

return "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
		<rng:grammar xmlns:rng=\"http://relaxng.org/ns/structure/1.0\" xmlns:a=\"http://relaxng.org/ns/compatibility/annotations/1.0\" xmlns:bch=\"http://benchmark\" datatypeLibrary=\"http://www.w3.org/2001/XMLSchema-datatypes\"> \
			<rng:start> \
				<rng:ref name=\"benchmark\"/> \
			</rng:start> \
			<rng:define name=\"benchmark\"> \
				<rng:element name=\"bch:benchmark\"> \
					<rng:ref name=\"recording\"/> \
				</rng:element> \
			</rng:define> \
			\
			<rng:define name=\"recording\"> \
				<rng:element name=\"bch:recording\"> \
					<rng:attribute name=\"celltypes\"> \
						<rng:list> \
							<rng:zeroOrMore> \
								<rng:choice> \
									<rng:value>X-ON</rng:value> \
									<rng:value>X-OFF</rng:value> \
									<rng:value>Y-ON</rng:value> \
									<rng:value>Y-OFF</rng:value> \
								</rng:choice> \
							</rng:zeroOrMore> \
						</rng:list> \
					</rng:attribute> \
				</rng:element> \
				<rng:element name=\"bch:protocols\"> \
					<rng:text/> \
				</rng:element> \
			</rng:define> \
		</rng:grammar>";
		
}