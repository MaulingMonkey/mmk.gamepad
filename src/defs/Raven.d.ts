/* Copyright 2017 MaulingMonkey

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/



// https://docs.sentry.io/clients/javascript/config/

type RavenTransportCallback = (options: {
	url:             string;
	data:            any; // JSON encode within transport?
	auth:            { sentry_version: string; sentry_client: string; sentry_key: string; };
	onSuccess:       ()=>void;
	onError:         ()=>void;
	allowDuplicates: boolean;
	allowSecretKey:  boolean;
	debug:           boolean;
}) => void;

interface RavenConfig {
	logger?:             string; // Default: "javascript"
	release?:            string;
	environment?:        string;
	serverName?:         string;
	tags?:               {};
	whitelistUrls?:      string[];
	ignoreErrors?:       string[];
	ignoreUrls?:         string[];
	includePaths?:       string[];
	sampleRate?:         number; // Default: 1.0
	dataCallback?:       (data: any) => any; // TODO: Determine type...?
	breadcrumbCallback?: (crumb: any) => any; // TODO: Determine type...?
	shouldSendCallback?: (data: any) => boolean;
	maxMessageLength?:   number; // Default: unlimited
	maxUrlLength?:       number; // Default: 250
	autoBreadcrumbs?:    boolean | { xhr?: boolean; console?: boolean; dom?: boolean; location?: boolean; }; // Default: true
	maxBreadcrumbs?:     number; // Default: 100
	transport?:          RavenTransportCallback;
}



// https://docs.sentry.io/clients/javascript/usage/

interface RavenMessageParams {
	fingerprint?: string[]; // Default: ["{{ default }}"]
	level?:       "info" | "warning" | "error";
	logger?:      string; // default: "javascript"
	tags?:        {}; // ...restrict to k/v pairs?
	extra?:       {};
}

interface RavenBreadcrumb {
	message:   string;
	category?: string;
	level?:    "error" | "warn" | "info" | "debug";
	data?:     {};
}

interface RavenUserContext {
	email?: string;
	id?:    string;
}

interface RavenSingleton {
	config(dsn: string, config?: RavenConfig): { install(): void };
	isSetup(): boolean;

	captureException(e: Error,      params?: RavenMessageParams): void;
	captureMessage(message: string, params?: RavenMessageParams): void;
	captureBreadcrumb(breadcrumb: RavenBreadcrumb): void;

	context<T>(                            a: ()=>T): T;
	context<T>(params: RavenMessageParams, a: ()=>T): T;
	wrap<F extends ()=>any>(                            a: F): F;
	wrap<F extends ()=>any>(params: RavenMessageParams, a: F): F;

	setUserContext(context?: RavenUserContext): void;
	setTagsContext(context?: {}): void;
	setExtraContext(context?: {}): void;

	lastEventId(): string;

	// https://docs.sentry.io/learn/user-feedback/
	showReportDialog(config?:{ eventId?: string; dsn?: string; }): void;

	setTransport(transport: RavenTransportCallback): void;
}

declare var Raven : RavenSingleton;
