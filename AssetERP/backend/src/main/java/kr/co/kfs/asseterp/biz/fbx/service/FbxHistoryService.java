package kr.co.kfs.asseterp.biz.fbx.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxHistoryRes;
import kr.co.kfs.asseterp.biz.fbx.mapper.FbxHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fbx/Fbx02_History.java selectByBoxId L28 (Fbx02_Popup_History) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FbxHistoryService {

    private final FbxHistoryMapper mapper;

    public List<FbxHistoryRes> searchByBoxId(UserPrincipal user, Long boxId) {
        return mapper.selectByBoxId(user.getCompanyId(), boxId);
    }
}
