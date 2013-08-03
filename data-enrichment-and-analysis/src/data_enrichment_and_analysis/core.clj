(ns data-enrichment-and-analysis.core
  (:require [net.cgrand.enlive-html :as html])
  (:require [clj-http.client :as client])
  (:use cascalog.api)
  (:use cascalog.playground)
  (:require [cascalog.ops :as c])
  (:require [clojure.java.io :as io]))

;; Enlive fetching part for vornamen.ch
(def base-url "http://www.vornamen.ch/suche2.php?menulevel=0")

(comment
  (with-open [wrt (io/writer "location_response.txt")]
    (.write wrt
             (get (:headers (client/post base-url {
                                                   :content-type :x-www-form-urlencoded
                                                   :form-params { :searchboxsubsubmitted "1"
                                                                 :searchbedeutungboxsubmitted ""
                                                                 :keyword "André"}})) "location")))
)

(comment
(defn fetch-url
  "Fetch the website response for a given name"
  [name]
  (:body (client/post base-url {:force-redirects true
                                :content-type :x-www-form-urlencoded
                                :form-params {:searchboxsubmitted "1"
                                              :searchbedeutungboxsubmitted ""
                                              :keyword name}})))
)

(comment
  (with-open [wrt (io/writer "response.html")]
    (.write wrt
            (fetch-url "André")))
)

(comment
  (with-open [wrt (io/writer "get-response.html")]
    (.write wrt
            (:body (client/get (str "http://www.vornamen.ch/name/" (.toLowerCase "andré") ".html")))))
)

(defn fetch-url
  "Fetch the website response for a given name"
  [name]
  (:body (client/get (str "http://www.vornamen.ch/name/" (.toLowerCase name) ".html"))))

(defn parse-response [name]
  (html/html-resource (java.io.StringReader. (fetch-url name))))

(defn common-in-languages [name]
  (Thread/sleep 5000)
  (map html/text
       (html/select
        (parse-response name) [:div#content :div.entry :table#p0 :a.sprachen])))

(comment
  (common-in-languages "Roger")
  (common-in-languages "André2")
)


;; Reading all the names and returning a distinct list of them. (no duplicates)
(defn name-only-row-tap [file-path]
  (<- [?name]
      ((lfs-textline file-path) ?line)
      (clojure.string/split ?line #"," 5 :> ?name _ _ _ _)
      (:distinct true)))

(comment
  (?- (lfs-textline "data/distinct-firstnames")
      (name-only-row-tap "data/firstnames.csv"))
)

(def foo
  "assiging the result of a cascalog query to a variable"
  (??-
   (name-only-row-tap "data/firstnames-sample.csv")))

foo

(count (nth foo 0))

(comment
  (map #(str "Hi " (first %1))
       (nth foo 0))
)

(comment
  (doseq
      [x (map #(common-in-languages (first %1))
              (nth foo 0))]
    (println x))
)

(comment
  (with-open [wrt (io/writer "languages-used-in.txt")]
    (doseq [x (map #(common-in-languages (first %1))
                   (nth foo 0))]
      (.write wrt (str (apply str (interpose "," x)) "\n"))))
)

(comment
  (with-open [wrt (io/writer "names.txt")]
    (doseq [x (map #(first %1)
                   (nth foo 0))]
      (.write wrt (str x "\n"))))
)


(range 1 10)

(common-in-languages "Roger")

(common-in-languages "AndrÃ©")

;; Sum up all the occurences for any given name
(defn parse-int [s] (Integer. s))

(comment
  ;; sum up all the names and sort via their sum
  (let [query (<- [?name ?sum]
                  ((lfs-textline "data/firstnames.csv") ?line)
                  (clojure.string/split ?line #"," 5 :> ?name _ ?str-count _ _)
                  (parse-int ?str-count :> ?count)
                  (c/sum ?count :> ?sum))]
    (?- (lfs-textline "data/output")
     (c/first-n query 50000
                :sort ["?sum"]
                :reverse true)))
)
