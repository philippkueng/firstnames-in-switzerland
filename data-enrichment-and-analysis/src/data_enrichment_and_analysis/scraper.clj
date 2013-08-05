(ns data-enrichtment-and-analysis.scraper
  (:require [net.cgrand.enlive-html :as html])
  (:require [clj-http.client :as client])
  (:require [clojure.java.io :as io])
  (:use cascalog.api)
  (:require [cascalog.ops :as c]))


;; ---
;; Make a distinct list of all names based on the data
;; ---

(def names
  (??- 
   (<- [?name]
       ((lfs-textline "data/firstnames.csv") ?line)
       (clojure.string/split ?line #"," 5 :> ?name _ _ _ _)
       (:distinct true))))

#_ Write the names variable to disk, to check wether the encoding is correct
(comment
  (with-open [wrt (io/writer "distinct-names.txt")]
    (doseq [x (nth names 0)]
      (.write wrt (str (nth x 0) "\n"))))
)


;; ---
;; The fetching and parsing part for vornamen.ch
;; ---

(def base-url "http://www.vornamen.ch/name/")

(defn fetch-url [name]
  (:body (client/get (str base-url (.toLowerCase name) ".html"))))

(defn parse-response [name]
  (html/html-resource (java.io.StringReader. (fetch-url name))))

(defn common-in-languages [name]
  ;;(Thread/sleep 2000)
  (map html/text
       (html/select
        (parse-response name) [:div#content :div.entry :table#p0 :a.sprachen])))

(comment
  (with-open [wrt (io/writer "common-in-languages-vornamen-dot-ch.txt")]
    (doseq
        [x (map #(common-in-languages (first %1))
                (nth names 0))]
      (.write wrt (str (apply str (interpose "," x)) "\n"))))
)
