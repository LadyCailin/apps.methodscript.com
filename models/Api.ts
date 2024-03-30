/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Metadata about an artifact. */
export interface BuildArtifact {
  /** The artifact name. */
  artifact: string;
  /** The build id, i.e. "build-123". */
  buildId: string;
  /**
   * The full artifact name, i.e. "build-123/artifact.jar".
   * This is what is used in the url to request the artifact.
   */
  name: string;
  /** The datetime when the artifact was built. yyyy-MM-dd'T'HH:mm:ss.SSSZ */
  date: string;
  /** The path for the url, i.e. "/builds/artifact/build-123%2Fartifact.jar". */
  link: string;
  /**
   * The full link to the artifact, including the host.
   * @format uri
   */
  fullLink: string;
  /**
   * The git sha hash of the commit that was used to make this build.
   * May be an empty string, if the commit isn't known, never null.
   */
  sha: string;
  /**
   * The git commit message of the commit used to make this build.
   * May be an empty string, if the commit isn't known, never null.
   */
  commitDetails: string;
  /**
   * A poisoned build shouldn't be recommended. This is a build that is known to have had problems, but
   * was already published, and will not be taken down.
   */
  poisoned: boolean;
}
