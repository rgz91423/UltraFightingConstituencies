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


matchInvariant Violation: Tried to get frame for out of range index NaN

This error is located at:
    in VirtualizedList (at FlatList.js:644)
    in FlatList (at Posts.js:91)
    in RCTView (at View.js:60)
    in View (at Posts.js:83)
    in Posts (at SceneView.js:10)
    in SceneView (at ResourceSavingSceneView.js:55)
    in RCTView (at View.js:60)
    in View (at ResourceSavingSceneView.js:48)
    in RCTView (at View.js:60)
    in View (at ResourceSavingSceneView.js:39)
    in ResourceSavingSceneView (at TabView.js:35)
    in RCTView (at View.js:60)
    in View (at TabViewPagerScroll.js:150)
    in RCTScrollContentView (at ScrollView.js:791)
    in RCTScrollView (at ScrollView.js:887)
    in ScrollView (at TabViewPagerScroll.js:128)
    in TabViewPagerScroll (at TabViewAnimated.js:71)
    in RCTView (at View.js:60)
    in View (at TabViewAnimated.js:194)
    in TabViewAnimated (at TabView.js:187)
    in TabView (at createNavigator.js:96)
    in Navigator (at createNavigationContainer.js:387)
    in NavigationContainer (at router.js:89)
    in Unknown (at renderApplication.js:33)
    in RCTView (at View.js:60)
    in View (at AppContainer.js:102)
    in RCTView (at View.js:60)
    in View (at AppContainer.js:122)
    in AppContainer (at renderApplication.js:32)

_getFrameMetrics
    VirtualizedList.js:1508:6
_getFrameMetricsApprox
    VirtualizedList.js:1475:40
computeWindowedRenderLimits
    VirtualizeUtils.js:117:47
<unknown>
    VirtualizedList.js:1410:14
processUpdateQueue
    ReactNativeRenderer-dev.js:6040:41
updateClassInstance
    ReactNativeRenderer-dev.js:7097:8
updateClassComponent
    ReactNativeRenderer-dev.js:8746:8
performUnitOfWork
    ReactNativeRenderer-dev.js:12924:25
workLoop
    ReactNativeRenderer-dev.js:12953:43
renderRoot
    ReactNativeRenderer-dev.js:12996:17
performWorkOnRoot
    ReactNativeRenderer-dev.js:13632:34
performWork
    ReactNativeRenderer-dev.js:13545:26
performSyncWork
    ReactNativeRenderer-dev.js:13506:16
requestWork
    ReactNativeRenderer-dev.js:13392:6
scheduleWorkImpl
    ReactNativeRenderer-dev.js:13259:24
enqueueSetState
    ReactNativeRenderer-dev.js:6224:19
setState
    react.development.js:242:31
_updateCellsToRender
    VirtualizedList.js:1396:18
<unknown>
    Batchinator.js:68:8
processNext
    TaskQueue.js:114:10
_processUpdate
    InteractionManager.js:205:6
_callTimer
    JSTimers.js:152:6
_callImmediatesPass
    JSTimers.js:200:17
callImmediates
    JSTimers.js:464:11
__callImmediates
    MessageQueue.js:327:4
<unknown>
    MessageQueue.js:145:6
__guardSafe
    MessageQueue.js:314:6
flushedQueue
    MessageQueue.js:144:17


