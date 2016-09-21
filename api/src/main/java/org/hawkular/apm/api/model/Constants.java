/*
 * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.hawkular.apm.api.model;

/**
 * This class provides constant definitions.
 *
 * @author gbrown
 */
public class Constants {

    private Constants() {}

    /**
     * Where trace activity begins within a client application, with the
     * invocation of a URI, any information derived from that activity
     * needs to be distinguished from the data derived from the server
     * trace fragment which is also associated with the same URI. Therefore
     * this constant defines a prefix that should be added to the URI when
     * deriving information about the client activity.
     */
    public static final String URI_CLIENT_PREFIX = "client:";

    /**
     * Property key representing service name
     */
    public static final String PROP_SERVICE_NAME = "service";

    /**
     * Details key representing a description of a fault.
     */
    public static final String DETAIL_FAULT_DESCRIPTION = "fault.description";

    /**
     * Represents database component type of
     * {@link org.hawkular.apm.api.model.trace.Component#componentType}
     */
    public static final String COMPONENT_DATABASE = "Database";

    /**
     * Represents EJB component type of
     * {@link org.hawkular.apm.api.model.trace.Component#componentType}
     */
    public static final String COMPONENT_EJB = "EJB";



    /**
     * Binary annotation key for HTTP URL.
     *
     * The entire URL, including the scheme, host and query parameters if available. See zipkinCoreConstants.
     */
    public static final String ZIPKIN_BIN_ANNOTATION_HTTP_URL = "http.url";

    /**
     * Binary annotation key for HTTP URL path.
     *
     * The absolute http path, without any query parameters. Ex. "/objects/abcd-ff"
     * Historical note: This was commonly expressed as "http.uri" in zipkin, eventhough it was most
     * often just a path. See zipkinCoreConstants.
     */
    public static final String ZIPKIN_BIN_ANNOTATION_HTTP_PATH = "http.path";

    /**
     * Binary annotation key for HTTP URL.
     *
     * See @{@link Constants#ZIPKIN_BIN_ANNOTATION_HTTP_PATH}.
     *
     * See zipkinCoreConstants
     */
    public static final String ZIPKIN_BIN_ANNOTATION_HTTP_URI = "http.uri";

    /**
     * The HTTP status code, when not in 2xx range. Ex. "503".  See zipkinCoreConstants.
     */
    public static final String ZIPKIN_BIN_ANNOTATION_HTTP_STATUS_CODE = "http.status_code";
}

