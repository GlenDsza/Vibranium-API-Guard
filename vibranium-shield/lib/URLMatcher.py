import re


class URLMatcher:
    def __init__(self, endpoints):
        self.endpoints = endpoints

    def pattern_to_regex(self, pattern):
        """
        Convert a URL pattern containing curly braces into a regex pattern.
        """
        # Replace segments like {item_name} with a regex pattern that matches any non-slash characters
        pattern = re.sub(r"\{[^/]+\}", r"[^/]+", pattern)
        # Remove leading and trailing slashes from the pattern
        pattern = re.sub(r"(^/|/$)", "", pattern)
        return pattern

    def getMatch(self, url_to_match, method):
        """
        Match the given URL against the list of patterns, prioritizing exact matches.
        """
        # First, check exact matches (patterns without variables)
        for edp in self.endpoints:
            print(edp["path"], edp["method"])
            if "path" not in edp or "method" not in edp:
                continue
            url = edp["path"]
            if not isinstance(method, str) or method.upper() != edp["method"].upper():
                continue
            if "{" not in url and "}" not in url:
                # Remove leading and trailing slashes from both the URL pattern and the URL to match
                exact_pattern = re.sub(r"(^/|/$)", "", url)
                if exact_pattern == url_to_match:
                    return url

        # If no exact match, check patterns with variables
        for edp in self.endpoints:
            if "path" not in edp or "method" not in edp:
                continue
            url = edp["path"]
            if not isinstance(method, str) or method.upper() != edp["method"].upper():
                continue

            if "{" in url and "}" in url:
                regex_pattern = self.pattern_to_regex(url)
                if re.fullmatch(regex_pattern, url_to_match):
                    return url

        return None

    def checkMatch(self, url_to_match, method):
        """
        Check if the given URL matches any of the URL patterns.
        """
        return self.getMatch(url_to_match, method) is not None
