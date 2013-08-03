(defproject data-enrichment-and-analysis "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [enlive "1.1.1"]
                 [clj-http "0.7.5"]
                 [cascalog "1.10.1"]]
  :profiles { :dev {:dependencies [[org.apache.hadoop/hadoop-core "0.20.2-dev"]]}}
  :jvm-opts ["-Xmx768m"])
