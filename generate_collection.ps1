
# Generate Postman Collection v2.1 JSON from YAML request files

$collectionId = [System.Guid]::NewGuid().ToString()
$items = [System.Collections.Generic.List[object]]::new()

function Build-Url($rawUrl) {
    return @{
        raw = $rawUrl
        host = @($rawUrl -replace 'https?://([^/]+).*', '$1')
        path = @(($rawUrl -replace 'https?://[^/]+/', '') -split '/')
    }
}

function Build-Auth($token) {
    return @{
        type = "bearer"
        bearer = @(
            @{ key = "token"; value = $token; type = "string" }
        )
    }
}

function Build-Body($bodyContent) {
    return @{
        mode = "raw"
        raw = $bodyContent
        options = @{
            raw = @{ language = "json" }
        }
    }
}

function Make-Item($name, $method, $url, $authToken, $bodyContent, $extraHeaders) {
    $req = [ordered]@{
        method = $method
        header = @()
        url = Build-Url $url
    }
    if ($extraHeaders) { $req.header = $extraHeaders }
    if ($authToken) { $req.auth = Build-Auth $authToken }
    if ($bodyContent) { $req.body = Build-Body $bodyContent }

    return @{
        name = $name
        request = $req
        response = @()
    }
}

# All 43 requests sorted by order value
$items.Add((Make-Item "LOGIN API Admin" "POST" "http://localhost:5000/api/auth/login" $null '{"email": "admin@gmail.com","password": "Dheeraj@2004"}' $null))
$items.Add((Make-Item "Get Profile" "GET" "http://localhost:5000/api/users/profile" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Update Profile-1" "GET" "http://localhost:5000/api/users/profile" $null $null $null))
$items.Add((Make-Item "Submit Feedback" "POST" "http://localhost:5000/api/feedback" "{{json_web_token_1cb9}}" '{"rating": 5,"feedback": "Excellent platform and user friendly interface"}' $null))
$items.Add((Make-Item "Login Api user" "POST" "http://localhost:5000/api/auth/login" $null '{"email": "99230040346@klu.ac.in","password": "Dheeraj@2004"}' $null))
$items.Add((Make-Item "Get All Feedbacks" "GET" "http://localhost:5000/api/feedback" "{{json_web_token_0ffk}}" $null $null))
$items.Add((Make-Item "Profile Analytics" "GET" "http://localhost:5000/api/profile-analytics" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Create Decision" "POST" "http://localhost:5000/api/decision/create" "{{json_web_token_1cb9}}" '{"title": "Choose Final Year Project","description": "Need to select a project","teamId": "6aba9c4352a3bb9199556320"}' $null))
$items.Add((Make-Item "Create Team" "POST" "http://localhost:5000/api/teams/create" "{{json_web_token_1cb9}}" '{"name": "Final Year Project Team","description": "Discussion for project selection"}' $null))
$items.Add((Make-Item "Get Team Decisions" "GET" "http://localhost:5000/api/decision/team/6aba9c8852a3bb9199556322" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Get All Teams" "GET" "http://localhost:5000/api/teams" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Register" "POST" "http://localhost:5000/api/auth/register" $null '{"name": "Dheeraj Kumar","email": "99230040407@klu.ac.in","password": "Dheeraj@2004"}' $null))
$items.Add((Make-Item "Verify OTP" "POST" "http://localhost:5000/api/auth/verify-email" $null '{"email": "99230040407@klu.ac.in","code": "793523"}' $null))
$items.Add((Make-Item "Reset Password API" "POST" "http://localhost:5000/api/auth/login" $null '{"email": "99230040407@klu.ac.in","password": "Dheeraj@2004"}' $null))
$items.Add((Make-Item "ForgotPassword" "POST" "http://localhost:5000/api/auth/forgot-password" $null '{"email": "99230040407@klu.ac.in"}' $null))
$items.Add((Make-Item "Get Team By ID" "GET" "http://localhost:5000/api/teams/6aba9c4352a3bb9199556320" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Update Team" "PUT" "http://localhost:5000/api/teams/6aba9c4352a3bb9199556320" "{{json_web_token_1cb9}}" '{"name": "Updated Team"}' $null))
$items.Add((Make-Item "Delete Team" "DELETE" "http://localhost:5000/api/teams/6abaa3db52a3bb9199556324" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Create Community" "POST" "http://localhost:5000/api/communities/create" "{{json_web_token_0ffk}}" '{"name": "Java Developers","description": "Community for Java developers","category": "Technology","image": ""}' @(@{key="Content-Type";value="application/json";type="text"})))
$items.Add((Make-Item "Get All Communities" "GET" "http://localhost:5000/api/communities" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Community Stats" "GET" "http://localhost:5000/api/communities/stats" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Leave Community" "POST" "http://localhost:5000/api/communities/6a9dd6386611d4166c8080ab/leave" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "UpdateCommunity" "PUT" "http://localhost:5000/api/communities/6a9dd6386611d4166c8080ab" "{{json_web_token_0ffk}}" '{"name": "AI Community Updated","description": "Updated Description"}' $null))
$items.Add((Make-Item "Delete Community" "DELETE" "http://localhost:5000/api/communities/6abaa64152a3bb9199556335" "{{json_web_token_0ffk}}" $null $null))
$items.Add((Make-Item "Get Analytics" "GET" "http://localhost:5000/api/analytics" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Dashboard Analytics" "GET" "http://localhost:5000/api/dashboard/analytics" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Recent Decisions" "GET" "http://localhost:5000/api/dashboard/recent-decisions" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Voting Participation" "GET" "http://localhost:5000/api/dashboard/voting-participation" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "LOGIN" "POST" "http://localhost:5000/api/auth/login" $null '{"email": "99230040407@klu.ac.in","password": "Dheeraj@2004"}' $null))
$items.Add((Make-Item "Update Profile" "PUT" "http://localhost:5000/api/users/profile" "{{json_web_token_1cb9}}" '{"name": "Dheeraj Kumar","phone": "9704566541"}' $null))
$items.Add((Make-Item "Create Poll" "POST" "http://localhost:5000/api/polls" "{{json_web_token_1cb9}}" '{"title": "Best Technology","description": "Vote your favorite technology","question": "Which technology do you like most?","options": [{"text": "Java"},{"text": "Python"},{"text": "MERN"}],"pollType": "single","visibility": "public","anonymous": false}' $null))
$items.Add((Make-Item "Get All Polls" "GET" "http://localhost:5000/api/polls" $null $null $null))
$items.Add((Make-Item "Get Poll By ID" "GET" "http://localhost:5000/api/polls/6a9b0515445809930c94f1f3" $null $null $null))
$items.Add((Make-Item "Update Poll" "PUT" "http://localhost:5000/api/polls/6a9b0515445809930c94f1f3" "{{json_web_token_0ffk}}" '{"title": "Updated Poll","description": "Updated Description"}' $null))
$items.Add((Make-Item "Delete Poll" "DELETE" "http://localhost:5000/api/polls/6a9b0515445809930c94f1f3" "{{json_web_token_0ffk}}" $null $null))
$items.Add((Make-Item "Check User Voted" "GET" "http://localhost:5000/api/polls/6a9b11c1733b0376292038d1/user/6a9b1fb7a66f112d7f9975e2/voted" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Total Polls" "GET" "http://localhost:5000/api/polls/total" $null $null $null))
$items.Add((Make-Item "Total Votes" "GET" "http://localhost:5000/api/polls/votes/total" $null $null $null))
$items.Add((Make-Item "Get All Notifications" "GET" "http://localhost:5000/api/notifications" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Mark Notification as Read" "PUT" "http://localhost:5000/api/notifications/6abaa3db52a3bb9199556325/read" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Delete Notification" "DELETE" "http://localhost:5000/api/notifications/6a9dbad44f050500bf1300f5" "{{json_web_token_1cb9}}" $null $null))
$items.Add((Make-Item "Create Option-Comparison" "POST" "http://localhost:5000/api/option-comparison" "{{json_web_token_1cb9}}" '{"title": "Laptop Comparison","decisionId": "68d95f7e1d2f23456789abc","description": "Compare MacBook vs Dell","options": [{"name": "MacBook Pro","score": 90},{"name": "Dell XPS","score": 85}]}' $null))
$items.Add((Make-Item "Get All Comparisons" "GET" "http://localhost:5000/api/option-comparison" "{{json_web_token_1cb9}}" $null $null))

$collection = [ordered]@{
    info = [ordered]@{
        "_postman_id" = $collectionId
        name = "DecisionHub APIs"
        schema = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    }
    item = $items.ToArray()
    variable = @(
        @{ key = "json_web_token_0mmf"; value = ""; type = "secret" }
        @{ key = "json_web_token_0zoh"; value = ""; type = "secret" }
        @{ key = "json_web_token_1cb9"; value = ""; type = "secret" }
        @{ key = "json_web_token_0ffk"; value = ""; type = "secret" }
    )
}

$json = $collection | ConvertTo-Json -Depth 20 -Compress:$false
$json | Out-File -FilePath "DecisionHub APIs.postman_collection.json" -Encoding UTF8
Write-Output "SUCCESS: Collection exported to DecisionHub APIs.postman_collection.json"
