  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];


ios/UltraFightingConstituencies/Info.plist
  <key>NSAppTransportSecurity</key>
	<dict>
		<key>NSExceptionDomains</key>
		<dict>
			<key>mobilecomic.com</key>
			<dict>
				<!--Include to allow subdomains-->
				<key>NSIncludesSubdomains</key>
				<true/>
				<!--Include to allow HTTP requests-->
				<key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
				<true/>
				<!--Include to specify minimum TLS version-->
				<key>NSTemporaryExceptionMinimumTLSVersion</key>
				<string>TLSv1.1</string>
			</dict>
		</dict>
	</dict>


	throw new Error("Chunk.entrypoints: Use Chunks.addGroup instead");

